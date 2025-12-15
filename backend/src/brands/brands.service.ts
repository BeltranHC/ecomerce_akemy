import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }

  async create(createBrandDto: CreateBrandDto) {
    const existingName = await this.prisma.brand.findUnique({
      where: { name: createBrandDto.name },
    });

    if (existingName) {
      throw new ConflictException('La marca ya existe');
    }

    // Generate slug from name if not provided
    const slug = createBrandDto.slug || this.generateSlug(createBrandDto.name);

    const existingSlug = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('El slug ya existe');
    }

    return this.prisma.brand.create({
      data: {
        ...createBrandDto,
        slug,
      },
    });
  }

  async findAll(params: { includeInactive?: boolean } = {}) {
    const where: any = {};

    if (!params.includeInactive) {
      where.isActive = true;
    }

    return this.prisma.brand.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (!brand || !brand.isActive) {
      throw new NotFoundException('Marca no encontrada');
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);

    if (updateBrandDto.name) {
      const existingName = await this.prisma.brand.findFirst({
        where: {
          name: updateBrandDto.name,
          NOT: { id },
        },
      });

      if (existingName) {
        throw new ConflictException('La marca ya existe');
      }
    }

    if (updateBrandDto.slug) {
      const existingSlug = await this.prisma.brand.findFirst({
        where: {
          slug: updateBrandDto.slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        throw new ConflictException('El slug ya existe');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const productsCount = await this.prisma.product.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException('No se puede eliminar una marca con productos');
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return { message: 'Marca eliminada exitosamente' };
  }

  async toggleActive(id: string) {
    const brand = await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data: { isActive: !brand.isActive },
    });
  }
}
