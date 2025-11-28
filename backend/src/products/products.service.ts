import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, MovementType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId?: string) {
    // Verificar SKU único
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException('El SKU ya existe');
    }

    // Verificar barcode único si se proporciona
    if (createProductDto.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: createProductDto.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException('El código de barra ya existe');
      }
    }

    // Verificar que la categoría existe
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('La categoría no existe');
    }

    // Crear producto
    const product = await this.prisma.product.create({
      data: {
        sku: createProductDto.sku,
        barcode: createProductDto.barcode,
        name: createProductDto.name,
        slug: createProductDto.slug,
        description: createProductDto.description,
        shortDescription: createProductDto.shortDescription,
        price: createProductDto.price,
        comparePrice: createProductDto.comparePrice,
        costPrice: createProductDto.costPrice,
        stock: createProductDto.stock || 0,
        lowStockAlert: createProductDto.lowStockAlert || 5,
        weight: createProductDto.weight,
        categoryId: createProductDto.categoryId,
        brandId: createProductDto.brandId,
        status: createProductDto.status || ProductStatus.DRAFT,
        isFeatured: createProductDto.isFeatured || false,
        metaTitle: createProductDto.metaTitle,
        metaDescription: createProductDto.metaDescription,
      },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    // Crear movimiento de inventario inicial si hay stock
    if (createProductDto.stock && createProductDto.stock > 0) {
      await this.prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: MovementType.INITIAL,
          quantity: createProductDto.stock,
          stockBefore: 0,
          stockAfter: createProductDto.stock,
          notes: 'Stock inicial',
          createdBy: userId,
        },
      });
    }

    return product;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      brandId,
      status,
      isFeatured,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (status) {
      where.status = status;
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Productos para tienda (solo publicados)
  async findAllPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    brandSlug?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 12,
      search,
      categorySlug,
      brandSlug,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      status: ProductStatus.PUBLISHED,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          stock: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product || product.status !== ProductStatus.PUBLISHED) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    // Verificar SKU único si se actualiza
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException('El SKU ya existe');
      }
    }

    // Verificar barcode único si se actualiza
    if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException('El código de barra ya existe');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Producto eliminado exitosamente' };
  }

  // Actualizar stock
  async updateStock(
    id: string,
    quantity: number,
    type: MovementType,
    notes?: string,
    userId?: string,
  ) {
    const product = await this.findOne(id);
    const currentStock = product.stock;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    // Actualizar producto
    await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    // Crear movimiento de inventario
    await this.prisma.inventoryMovement.create({
      data: {
        productId: id,
        type,
        quantity,
        stockBefore: currentStock,
        stockAfter: newStock,
        notes,
        createdBy: userId,
      },
    });

    return { stock: newStock, message: 'Stock actualizado' };
  }

  // Productos destacados
  async getFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        isFeatured: true,
      },
      take: limit,
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Productos con bajo stock
  async getLowStock(threshold = 10) {
    return this.prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        stock: { lte: threshold },
      },
      select: {
        id: true,
        sku: true,
        name: true,
        stock: true,
        lowStockAlert: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { stock: 'asc' },
    });
  }

  // Productos relacionados
  async getRelated(productId: string, limit = 4) {
    const product = await this.findOne(productId);

    return this.prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        categoryId: product.categoryId,
        id: { not: productId },
      },
      take: limit,
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    });
  }

  // Agregar imagen a producto
  async addImage(productId: string, imageData: { url: string; alt?: string; isPrimary?: boolean }) {
    await this.findOne(productId);

    // Si es imagen principal, quitar flag de las demás
    if (imageData.isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
    });

    return this.prisma.productImage.create({
      data: {
        productId,
        url: imageData.url,
        alt: imageData.alt,
        isPrimary: imageData.isPrimary || false,
        sortOrder: (lastImage?.sortOrder || 0) + 1,
      },
    });
  }

  // Eliminar imagen
  async removeImage(imageId: string) {
    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    return { message: 'Imagen eliminada' };
  }

  // Buscar por código de barra o SKU
  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { sku: { equals: query, mode: 'insensitive' } },
          { barcode: { equals: query } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        sku: true,
        barcode: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        status: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    });
  }
}
