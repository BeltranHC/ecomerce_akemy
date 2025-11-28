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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BrandsService = class BrandsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBrandDto) {
        const existingName = await this.prisma.brand.findUnique({
            where: { name: createBrandDto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException('La marca ya existe');
        }
        const existingSlug = await this.prisma.brand.findUnique({
            where: { slug: createBrandDto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('El slug ya existe');
        }
        return this.prisma.brand.create({
            data: createBrandDto,
        });
    }
    async findAll(params = {}) {
        const where = {};
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
    async findOne(id) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Marca no encontrada');
        }
        return brand;
    }
    async findBySlug(slug) {
        const brand = await this.prisma.brand.findUnique({
            where: { slug },
        });
        if (!brand || !brand.isActive) {
            throw new common_1.NotFoundException('Marca no encontrada');
        }
        return brand;
    }
    async update(id, updateBrandDto) {
        await this.findOne(id);
        if (updateBrandDto.name) {
            const existingName = await this.prisma.brand.findFirst({
                where: {
                    name: updateBrandDto.name,
                    NOT: { id },
                },
            });
            if (existingName) {
                throw new common_1.ConflictException('La marca ya existe');
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
                throw new common_1.ConflictException('El slug ya existe');
            }
        }
        return this.prisma.brand.update({
            where: { id },
            data: updateBrandDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const productsCount = await this.prisma.product.count({
            where: { brandId: id },
        });
        if (productsCount > 0) {
            throw new common_1.ConflictException('No se puede eliminar una marca con productos');
        }
        await this.prisma.brand.delete({
            where: { id },
        });
        return { message: 'Marca eliminada exitosamente' };
    }
    async toggleActive(id) {
        const brand = await this.findOne(id);
        return this.prisma.brand.update({
            where: { id },
            data: { isActive: !brand.isActive },
        });
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map