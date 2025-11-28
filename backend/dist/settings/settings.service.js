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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.storeSetting.findMany({
            orderBy: [{ group: 'asc' }, { key: 'asc' }],
        });
    }
    async findByGroup(group) {
        return this.prisma.storeSetting.findMany({
            where: { group },
            orderBy: { key: 'asc' },
        });
    }
    async findByKey(key) {
        const setting = await this.prisma.storeSetting.findUnique({
            where: { key },
        });
        if (!setting) {
            throw new common_1.NotFoundException('Configuración no encontrada');
        }
        return setting;
    }
    async getValue(key) {
        const setting = await this.prisma.storeSetting.findUnique({
            where: { key },
        });
        return setting?.value || null;
    }
    async update(key, updateDto) {
        const setting = await this.prisma.storeSetting.findUnique({
            where: { key },
        });
        if (setting) {
            return this.prisma.storeSetting.update({
                where: { key },
                data: { value: updateDto.value },
            });
        }
        return this.prisma.storeSetting.create({
            data: {
                key,
                value: updateDto.value,
                type: updateDto.type || 'string',
                group: updateDto.group || 'general',
            },
        });
    }
    async updateMany(settings) {
        const results = [];
        for (const setting of settings) {
            const result = await this.update(setting.key, { value: setting.value });
            results.push(result);
        }
        return results;
    }
    async getPublicSettings() {
        const settings = await this.prisma.storeSetting.findMany({
            where: {
                key: {
                    in: [
                        'store_name',
                        'store_description',
                        'store_phone',
                        'store_email',
                        'store_address',
                        'currency',
                        'currency_symbol',
                        'logo_url',
                        'favicon_url',
                        'shipping_cost',
                        'free_shipping_min',
                    ],
                },
            },
        });
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map