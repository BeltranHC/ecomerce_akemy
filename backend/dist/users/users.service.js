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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El correo electrónico ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                email: createUserDto.email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isVerified: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async findAll(params) {
        const { page = 1, limit = 10, search, role, isActive } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = role;
        }
        if (typeof isActive === 'boolean') {
            where.isActive = isActive;
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isVerified: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
                addresses: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    email: updateUserDto.email.toLowerCase(),
                    NOT: { id },
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException('El correo electrónico ya está en uso');
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                email: updateUserDto.email?.toLowerCase(),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isVerified: true,
                isActive: true,
                updatedAt: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'Usuario eliminado exitosamente' };
    }
    async toggleActive(id) {
        const user = await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                isActive: true,
            },
        });
    }
    async getCustomers(params) {
        const { page = 1, limit = 10, search } = params;
        const skip = (page - 1) * limit;
        const where = {
            role: client_1.UserRole.CUSTOMER,
        };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [customers, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    isVerified: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                    orders: {
                        select: {
                            id: true,
                            orderNumber: true,
                            total: true,
                            status: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 5,
                    },
                    _count: {
                        select: { orders: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: customers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map