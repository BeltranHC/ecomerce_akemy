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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BannersService = class BannersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBannerDto) {
        return this.prisma.banner.create({
            data: createBannerDto,
        });
    }
    async findAll(params = {}) {
        const where = {};
        if (!params.includeInactive) {
            where.isActive = true;
            const now = new Date();
            where.OR = [
                { startDate: null, endDate: null },
                { startDate: { lte: now }, endDate: null },
                { startDate: null, endDate: { gte: now } },
                { startDate: { lte: now }, endDate: { gte: now } },
            ];
        }
        return this.prisma.banner.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id) {
        const banner = await this.prisma.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new common_1.NotFoundException('Banner no encontrado');
        }
        return banner;
    }
    async update(id, updateBannerDto) {
        await this.findOne(id);
        return this.prisma.banner.update({
            where: { id },
            data: updateBannerDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.banner.delete({
            where: { id },
        });
        return { message: 'Banner eliminado exitosamente' };
    }
    async toggleActive(id) {
        const banner = await this.findOne(id);
        return this.prisma.banner.update({
            where: { id },
            data: { isActive: !banner.isActive },
        });
    }
    async getActiveBanners() {
        const now = new Date();
        return this.prisma.banner.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: now }, endDate: null },
                    { startDate: null, endDate: { gte: now } },
                    { startDate: { lte: now }, endDate: { gte: now } },
                ],
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map