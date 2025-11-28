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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async create(createOrderDto, userId) {
        let addressId = createOrderDto.addressId;
        if (!addressId && createOrderDto.shippingAddress) {
            const newAddress = await this.prisma.address.create({
                data: {
                    userId,
                    label: 'Dirección de pedido',
                    recipientName: `${createOrderDto.shippingAddress.firstName} ${createOrderDto.shippingAddress.lastName}`,
                    phone: createOrderDto.shippingAddress.phone,
                    street: createOrderDto.shippingAddress.address,
                    number: '',
                    district: createOrderDto.shippingAddress.district,
                    city: createOrderDto.shippingAddress.city,
                    province: createOrderDto.shippingAddress.city,
                    department: createOrderDto.shippingAddress.city,
                    postalCode: createOrderDto.shippingAddress.postalCode || '',
                    isDefault: false,
                },
            });
            addressId = newAddress.id;
        }
        if (!addressId) {
            const defaultAddress = await this.prisma.address.findFirst({
                where: { userId, isDefault: true },
            });
            if (!defaultAddress) {
                throw new common_1.BadRequestException('Se requiere una dirección de envío');
            }
            addressId = defaultAddress.id;
        }
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
        });
        if (!address) {
            throw new common_1.BadRequestException('Dirección no encontrada');
        }
        let items = createOrderDto.items;
        if ((!items || items.length === 0) || createOrderDto.useCart) {
            const cart = await this.prisma.cart.findUnique({
                where: { userId },
                include: { items: true },
            });
            if (!cart || cart.items.length === 0) {
                throw new common_1.BadRequestException('El carrito está vacío');
            }
            items = cart.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId || undefined,
                quantity: item.quantity,
            }));
        }
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('El pedido debe tener al menos un producto');
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                include: { variants: true },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Producto ${item.productId} no encontrado`);
            }
            let price = Number(product.price);
            let stock = product.stock;
            if (item.variantId) {
                const variant = product.variants.find(v => v.id === item.variantId);
                if (!variant) {
                    throw new common_1.BadRequestException(`Variante ${item.variantId} no encontrada`);
                }
                if (variant.price) {
                    price = Number(variant.price);
                }
                stock = variant.stock;
            }
            if (stock < item.quantity) {
                throw new common_1.BadRequestException(`Stock insuficiente para ${product.name}`);
            }
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: product.id,
                variantId: item.variantId,
                productName: product.name,
                sku: product.sku,
                price,
                quantity: item.quantity,
                total: itemTotal,
            });
        }
        const shippingCost = createOrderDto.shippingCost || 0;
        const discount = createOrderDto.discount || 0;
        const total = subtotal + shippingCost - discount;
        const orderNumber = await this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                addressId: address.id,
                subtotal,
                shippingCost,
                discount,
                total,
                notes: createOrderDto.notes,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                images: {
                                    orderBy: { sortOrder: 'asc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                address: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        for (const item of orderItems) {
            await this.productsService.updateStock(item.productId, -item.quantity, client_1.MovementType.SALE, `Venta - Orden ${orderNumber}`, userId);
        }
        const userCart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (userCart) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: userCart.id },
            });
        }
        return order;
    }
    async findAll(params) {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;
        const { status, userId, startDate, endDate, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userId) {
            where.userId = userId;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    items: {
                        select: {
                            id: true,
                            productName: true,
                            quantity: true,
                            total: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                address: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                slug: true,
                                images: {
                                    orderBy: { sortOrder: 'asc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                address: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                slug: true,
                                images: {
                                    orderBy: { sortOrder: 'asc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return order;
    }
    async updateStatus(id, updateStatusDto, adminId) {
        const order = await this.findOne(id);
        const updateData = {
            status: updateStatusDto.status,
        };
        switch (updateStatusDto.status) {
            case client_1.OrderStatus.PAID:
                updateData.paidAt = new Date();
                break;
            case client_1.OrderStatus.SHIPPED:
                updateData.shippedAt = new Date();
                break;
            case client_1.OrderStatus.DELIVERED:
                updateData.deliveredAt = new Date();
                break;
            case client_1.OrderStatus.CANCELLED:
                updateData.cancelledAt = new Date();
                updateData.cancellationReason = updateStatusDto.reason;
                for (const item of order.items) {
                    await this.productsService.updateStock(item.productId, item.quantity, client_1.MovementType.RETURN, `Cancelación - Orden ${order.orderNumber}`, adminId);
                }
                break;
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                action: 'STATUS_CHANGE',
                entity: 'Order',
                entityId: id,
                oldValues: { status: order.status },
                newValues: { status: updateStatusDto.status },
            },
        });
        return updatedOrder;
    }
    async getCustomerOrders(userId, params) {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    slug: true,
                                    images: {
                                        orderBy: { sortOrder: 'asc' },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSalesStats(params) {
        const { startDate, endDate } = params;
        const where = {
            status: {
                in: [client_1.OrderStatus.PAID, client_1.OrderStatus.PREPARING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED],
            },
        };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const [totalOrders, totalSales, orders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.aggregate({
                where,
                _sum: { total: true },
            }),
            this.prisma.order.findMany({
                where,
                select: {
                    total: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        const salesByDay = orders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += Number(order.total);
            return acc;
        }, {});
        return {
            totalOrders,
            totalSales: totalSales._sum.total || 0,
            salesByDay: Object.entries(salesByDay).map(([date, total]) => ({ date, total })),
        };
    }
    async generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const prefix = `AK${year}${month}${day}`;
        const lastOrder = await this.prisma.order.findFirst({
            where: {
                orderNumber: {
                    startsWith: prefix,
                },
            },
            orderBy: { orderNumber: 'desc' },
        });
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `${prefix}${sequence.toString().padStart(4, '0')}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map