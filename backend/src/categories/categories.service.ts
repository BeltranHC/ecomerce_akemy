import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('El slug ya existe');
    }

    // Verificar categoría padre si existe
    if (createCategoryDto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('La categoría padre no existe');
      }
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findAll(params: { includeInactive?: boolean } = {}) {
    const where: any = {};

    if (!params.includeInactive) {
      where.isActive = true;
    }

    return this.prisma.category.findMany({
      where: {
        ...where,
        parentId: null, // Solo categorías principales
      },
      include: {
        children: {
          where: params.includeInactive ? {} : { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllFlat(params: { includeInactive?: boolean } = {}) {
    const where: any = {};

    if (!params.includeInactive) {
      where.isActive = true;
    }

    return this.prisma.category.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    // Verificar slug único si se actualiza
    if (updateCategoryDto.slug) {
      const existingSlug = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        throw new ConflictException('El slug ya existe');
      }
    }

    // Verificar que no sea su propio padre
    if (updateCategoryDto.parentId === id) {
      throw new ConflictException('Una categoría no puede ser su propio padre');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Verificar si tiene subcategorías
    if (category.children && category.children.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con subcategorías');
    }

    // Verificar si tiene productos
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException('No se puede eliminar una categoría con productos');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Categoría eliminada exitosamente' };
  }

  async toggleActive(id: string) {
    const category = await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
      select: {
        id: true,
        isActive: true,
      },
    });
  }

  // Obtener categorías principales para el menú
  async getMainCategories() {
    return this.prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
