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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto, userId) {
        const existingSku = await this.prisma.product.findUnique({
            where: { sku: createProductDto.sku },
        });
        if (existingSku) {
            throw new common_1.ConflictException('El SKU ya existe');
        }
        if (createProductDto.barcode) {
            const existingBarcode = await this.prisma.product.findUnique({
                where: { barcode: createProductDto.barcode },
            });
            if (existingBarcode) {
                throw new common_1.ConflictException('El código de barra ya existe');
            }
        }
        const category = await this.prisma.category.findUnique({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('La categoría no existe');
        }
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
                status: createProductDto.status || client_1.ProductStatus.DRAFT,
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
        if (createProductDto.stock && createProductDto.stock > 0) {
            await this.prisma.inventoryMovement.create({
                data: {
                    productId: product.id,
                    type: client_1.MovementType.INITIAL,
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
    async findAll(params) {
        const { page = 1, limit = 12, search, categoryId, brandId, status, isFeatured, minPrice, maxPrice, inStock, sortBy = 'createdAt', sortOrder = 'desc', } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (inStock) {
            where.stock = { gt: 0 };
        }
        const orderBy = {};
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
    async findAllPublished(params) {
        const { page = 1, limit = 12, search, categorySlug, brandSlug, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', } = params;
        const skip = (page - 1) * limit;
        const where = {
            status: client_1.ProductStatus.PUBLISHED,
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
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        const orderBy = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async findBySlug(slug) {
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
        if (!product || product.status !== client_1.ProductStatus.PUBLISHED) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingSku = await this.prisma.product.findUnique({
                where: { sku: updateProductDto.sku },
            });
            if (existingSku) {
                throw new common_1.ConflictException('El SKU ya existe');
            }
        }
        if (updateProductDto.barcode && updateProductDto.barcode !== product.barcode) {
            const existingBarcode = await this.prisma.product.findUnique({
                where: { barcode: updateProductDto.barcode },
            });
            if (existingBarcode) {
                throw new common_1.ConflictException('El código de barra ya existe');
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Producto eliminado exitosamente' };
    }
    async updateStock(id, quantity, type, notes, userId) {
        const product = await this.findOne(id);
        const currentStock = product.stock;
        const newStock = currentStock + quantity;
        if (newStock < 0) {
            throw new common_1.BadRequestException('El stock no puede ser negativo');
        }
        await this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
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
    async getFeatured(limit = 8) {
        return this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.PUBLISHED,
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
    async getLowStock(threshold = 10) {
        return this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.PUBLISHED,
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
    async getRelated(productId, limit = 4) {
        const product = await this.findOne(productId);
        return this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.PUBLISHED,
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
    async addImage(productId, imageData) {
        await this.findOne(productId);
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
    async removeImage(imageId) {
        await this.prisma.productImage.delete({
            where: { id: imageId },
        });
        return { message: 'Imagen eliminada' };
    }
    async search(query) {
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map