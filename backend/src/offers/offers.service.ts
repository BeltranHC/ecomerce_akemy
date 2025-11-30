import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, OfferType } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(createOfferDto: CreateOfferDto) {
    const slug = createOfferDto.slug || this.generateSlug(createOfferDto.name);

    // Verificar que el slug sea único
    const existingOffer = await this.prisma.offer.findUnique({
      where: { slug },
    });

    if (existingOffer) {
      throw new BadRequestException('Ya existe una oferta con ese slug');
    }

    const offer = await this.prisma.offer.create({
      data: {
        name: createOfferDto.name,
        slug,
        description: createOfferDto.description,
        type: createOfferDto.type,
        value: createOfferDto.value,
        isActive: createOfferDto.isActive ?? true,
        startDate: new Date(createOfferDto.startDate),
        endDate: new Date(createOfferDto.endDate),
        products: createOfferDto.products?.length ? {
          create: createOfferDto.products.map((p) => ({
            productId: p.productId,
            specialPrice: p.specialPrice,
          })),
        } : undefined,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return offer;
  }

  async findAll(params: { page?: number; limit?: number; isActive?: boolean }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    const [offers, total] = await Promise.all([
      this.prisma.offer.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.offer.count({ where }),
    ]);

    return {
      data: offers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                stock: true,
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return offer;
  }

  async findBySlug(slug: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return offer;
  }

  async getActiveOffers() {
    const now = new Date();
    
    const offers = await this.prisma.offer.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return offers;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    await this.findOne(id);

    // Si se actualiza el slug, verificar unicidad
    if (updateOfferDto.slug) {
      const existingOffer = await this.prisma.offer.findFirst({
        where: {
          slug: updateOfferDto.slug,
          NOT: { id },
        },
      });

      if (existingOffer) {
        throw new BadRequestException('Ya existe una oferta con ese slug');
      }
    }

    // Actualizar productos si se proporcionan
    if (updateOfferDto.products) {
      // Eliminar productos anteriores
      await this.prisma.offerProduct.deleteMany({
        where: { offerId: id },
      });

      // Crear nuevos productos
      if (updateOfferDto.products.length > 0) {
        await this.prisma.offerProduct.createMany({
          data: updateOfferDto.products.map((p) => ({
            offerId: id,
            productId: p.productId,
            specialPrice: p.specialPrice,
          })),
        });
      }
    }

    const offer = await this.prisma.offer.update({
      where: { id },
      data: {
        name: updateOfferDto.name,
        slug: updateOfferDto.slug,
        description: updateOfferDto.description,
        type: updateOfferDto.type,
        value: updateOfferDto.value,
        isActive: updateOfferDto.isActive,
        startDate: updateOfferDto.startDate ? new Date(updateOfferDto.startDate) : undefined,
        endDate: updateOfferDto.endDate ? new Date(updateOfferDto.endDate) : undefined,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return offer;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.offer.delete({
      where: { id },
    });

    return { message: 'Oferta eliminada correctamente' };
  }

  async addProduct(offerId: string, productId: string, specialPrice?: number) {
    const offer = await this.findOne(offerId);
    
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar si ya está en la oferta
    const existingProduct = await this.prisma.offerProduct.findUnique({
      where: {
        offerId_productId: { offerId, productId },
      },
    });

    if (existingProduct) {
      throw new BadRequestException('El producto ya está en esta oferta');
    }

    return this.prisma.offerProduct.create({
      data: {
        offerId,
        productId,
        specialPrice,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
      },
    });
  }

  async removeProduct(offerId: string, productId: string) {
    await this.findOne(offerId);

    const offerProduct = await this.prisma.offerProduct.findUnique({
      where: {
        offerId_productId: { offerId, productId },
      },
    });

    if (!offerProduct) {
      throw new NotFoundException('El producto no está en esta oferta');
    }

    await this.prisma.offerProduct.delete({
      where: {
        offerId_productId: { offerId, productId },
      },
    });

    return { message: 'Producto eliminado de la oferta' };
  }

  async updateProductPrice(offerId: string, productId: string, specialPrice: number) {
    await this.findOne(offerId);

    const offerProduct = await this.prisma.offerProduct.findUnique({
      where: {
        offerId_productId: { offerId, productId },
      },
    });

    if (!offerProduct) {
      throw new NotFoundException('El producto no está en esta oferta');
    }

    return this.prisma.offerProduct.update({
      where: {
        offerId_productId: { offerId, productId },
      },
      data: { specialPrice },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
  }

  // Calcular precio con descuento para un producto
  async getProductOfferPrice(productId: string): Promise<{ hasOffer: boolean; originalPrice: number; offerPrice?: number; offer?: any }> {
    const now = new Date();

    const offerProduct = await this.prisma.offerProduct.findFirst({
      where: {
        productId,
        offer: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: {
        offer: true,
        product: {
          select: { price: true },
        },
      },
    });

    if (!offerProduct) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });
      return {
        hasOffer: false,
        originalPrice: Number(product?.price || 0),
      };
    }

    const originalPrice = Number(offerProduct.product.price);
    let offerPrice: number;

    if (offerProduct.specialPrice) {
      offerPrice = Number(offerProduct.specialPrice);
    } else {
      switch (offerProduct.offer.type) {
        case 'PERCENTAGE':
          offerPrice = originalPrice * (1 - Number(offerProduct.offer.value) / 100);
          break;
        case 'FIXED_AMOUNT':
          offerPrice = originalPrice - Number(offerProduct.offer.value);
          break;
        case 'SPECIAL_PRICE':
          offerPrice = Number(offerProduct.offer.value);
          break;
        default:
          offerPrice = originalPrice;
      }
    }

    return {
      hasOffer: true,
      originalPrice,
      offerPrice: Math.max(0, offerPrice),
      offer: {
        id: offerProduct.offer.id,
        name: offerProduct.offer.name,
        type: offerProduct.offer.type,
        value: offerProduct.offer.value,
        endDate: offerProduct.offer.endDate,
      },
    };
  }
}
