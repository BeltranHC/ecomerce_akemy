"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const existingSlug = await this.prisma.category.findUnique({
            where: { slug: createCategoryDto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('El slug ya existe');
        }
        if (createCategoryDto.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: createCategoryDto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('La categoría padre no existe');
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
    async findAll(params = {}) {
        const where = {};
        if (!params.includeInactive) {
            where.isActive = true;
        }
        return this.prisma.category.findMany({
            where: {
                ...where,
                parentId: null,
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
    async findAllFlat(params = {}) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return category;
    }
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        if (updateCategoryDto.slug) {
            const existingSlug = await this.prisma.category.findFirst({
                where: {
                    slug: updateCategoryDto.slug,
                    NOT: { id },
                },
            });
            if (existingSlug) {
                throw new common_1.ConflictException('El slug ya existe');
            }
        }
        if (updateCategoryDto.parentId === id) {
            throw new common_1.ConflictException('Una categoría no puede ser su propio padre');
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
    async remove(id) {
        const category = await this.findOne(id);
        if (category.children && category.children.length > 0) {
            throw new common_1.ConflictException('No se puede eliminar una categoría con subcategorías');
        }
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productsCount > 0) {
            throw new common_1.ConflictException('No se puede eliminar una categoría con productos');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Categoría eliminada exitosamente' };
    }
    async toggleActive(id) {
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map