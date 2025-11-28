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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const [totalProducts, totalOrders, totalCustomers, pendingOrders, todaySales, monthSales, yearSales, lowStockProducts, recentOrders, topProducts,] = await Promise.all([
            this.prisma.product.count({
                where: { status: client_1.ProductStatus.PUBLISHED },
            }),
            this.prisma.order.count(),
            this.prisma.user.count({
                where: { role: client_1.UserRole.CUSTOMER },
            }),
            this.prisma.order.count({
                where: { status: client_1.OrderStatus.PENDING },
            }),
            this.prisma.order.aggregate({
                where: {
                    createdAt: { gte: today },
                    status: { in: [client_1.OrderStatus.PAID, client_1.OrderStatus.PREPARING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED] },
                },
                _sum: { total: true },
                _count: true,
            }),
            this.prisma.order.aggregate({
                where: {
                    createdAt: { gte: startOfMonth },
                    status: { in: [client_1.OrderStatus.PAID, client_1.OrderStatus.PREPARING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED] },
                },
                _sum: { total: true },
                _count: true,
            }),
            this.prisma.order.aggregate({
                where: {
                    createdAt: { gte: startOfYear },
                    status: { in: [client_1.OrderStatus.PAID, client_1.OrderStatus.PREPARING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED] },
                },
                _sum: { total: true },
                _count: true,
            }),
            this.prisma.product.findMany({
                where: {
                    status: client_1.ProductStatus.PUBLISHED,
                    stock: { lte: 10 },
                },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    stock: true,
                    lowStockAlert: true,
                },
                orderBy: { stock: 'asc' },
                take: 10,
            }),
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    total: true,
                    createdAt: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            this.prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
        ]);
        const topProductsWithDetails = await Promise.all(topProducts.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                },
            });
            return {
                ...product,
                totalSold: item._sum.quantity,
            };
        }));
        return {
            overview: {
                totalProducts,
                totalOrders,
                totalCustomers,
                pendingOrders,
            },
            sales: {
                today: {
                    total: todaySales._sum.total || 0,
                    count: todaySales._count,
                },
                month: {
                    total: monthSales._sum.total || 0,
                    count: monthSales._count,
                },
                year: {
                    total: yearSales._sum.total || 0,
                    count: yearSales._count,
                },
            },
            lowStockProducts,
            recentOrders,
            topProducts: topProductsWithDetails,
        };
    }
    async getSalesChart(params) {
        const { period } = params;
        const now = new Date();
        let startDate;
        let groupBy;
        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                groupBy = 'day';
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                groupBy = 'day';
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                groupBy = 'month';
                break;
        }
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { in: [client_1.OrderStatus.PAID, client_1.OrderStatus.PREPARING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED] },
            },
            select: {
                total: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const salesByPeriod = {};
        orders.forEach((order) => {
            let key;
            const date = new Date(order.createdAt);
            if (groupBy === 'day') {
                key = date.toISOString().split('T')[0];
            }
            else if (groupBy === 'month') {
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            else {
                key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
            }
            if (!salesByPeriod[key]) {
                salesByPeriod[key] = 0;
            }
            salesByPeriod[key] += Number(order.total);
        });
        return Object.entries(salesByPeriod).map(([date, total]) => ({
            date,
            total,
        }));
    }
    async getOrdersByStatus() {
        const ordersByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: true,
        });
        return ordersByStatus.map((item) => ({
            status: item.status,
            count: item._count,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map