import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        overview: {
            totalProducts: number;
            totalOrders: number;
            totalCustomers: number;
            pendingOrders: number;
        };
        sales: {
            today: {
                total: number | import("@prisma/client/runtime/library").Decimal;
                count: number;
            };
            month: {
                total: number | import("@prisma/client/runtime/library").Decimal;
                count: number;
            };
            year: {
                total: number | import("@prisma/client/runtime/library").Decimal;
                count: number;
            };
        };
        lowStockProducts: {
            name: string;
            id: string;
            sku: string;
            stock: number;
            lowStockAlert: number;
        }[];
        recentOrders: {
            user: {
                firstName: string;
                lastName: string;
            };
            id: string;
            createdAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
        }[];
        topProducts: {
            totalSold: number | null;
            name?: string | undefined;
            id?: string | undefined;
            sku?: string | undefined;
            price?: import("@prisma/client/runtime/library").Decimal | undefined;
        }[];
    }>;
    getSalesChart(period?: 'week' | 'month' | 'year'): Promise<{
        date: string;
        total: number;
    }[]>;
    getOrdersByStatus(): Promise<{
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
    }[]>;
}
