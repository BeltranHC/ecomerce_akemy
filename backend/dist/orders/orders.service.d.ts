import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private prisma;
    private productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        address: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phone: string;
            street: string;
            apartment: string | null;
            district: string;
            city: string;
            province: string;
            department: string;
            postalCode: string | null;
            reference: string | null;
            isDefault: boolean;
        };
        items: ({
            product: {
                images: {
                    id: string;
                    productId: string;
                    sortOrder: number;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            };
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        paymentMethod: string | null;
        paymentId: string | null;
        paidAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        status?: OrderStatus;
        userId?: string;
        startDate?: Date;
        endDate?: Date;
        search?: string;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            items: {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                productName: string;
                quantity: number;
            }[];
        } & {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            paymentMethod: string | null;
            paymentId: string | null;
            paidAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            cancellationReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            addressId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            phone: string | null;
            email: string;
            firstName: string;
            lastName: string;
        };
        address: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phone: string;
            street: string;
            apartment: string | null;
            district: string;
            city: string;
            province: string;
            department: string;
            postalCode: string | null;
            reference: string | null;
            isDefault: boolean;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                images: {
                    id: string;
                    productId: string;
                    sortOrder: number;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            };
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        paymentMethod: string | null;
        paymentId: string | null;
        paidAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string;
    }>;
    findByOrderNumber(orderNumber: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        address: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phone: string;
            street: string;
            apartment: string | null;
            district: string;
            city: string;
            province: string;
            department: string;
            postalCode: string | null;
            reference: string | null;
            isDefault: boolean;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                images: {
                    id: string;
                    productId: string;
                    sortOrder: number;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            };
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            productName: string;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        paymentMethod: string | null;
        paymentId: string | null;
        paidAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, adminId?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        paymentMethod: string | null;
        paymentId: string | null;
        paidAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string;
    }>;
    getCustomerOrders(userId: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            items: ({
                product: {
                    slug: string;
                    images: {
                        id: string;
                        productId: string;
                        sortOrder: number;
                        url: string;
                        alt: string | null;
                        isPrimary: boolean;
                    }[];
                };
            } & {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                productName: string;
                sku: string;
                price: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                productId: string;
                variantId: string | null;
                orderId: string;
            })[];
        } & {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            paymentMethod: string | null;
            paymentId: string | null;
            paidAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            cancellationReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            addressId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSalesStats(params: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        totalOrders: number;
        totalSales: number | import("@prisma/client/runtime/library").Decimal;
        salesByDay: {
            date: string;
            total: unknown;
        }[];
    }>;
    private generateOrderNumber;
}
