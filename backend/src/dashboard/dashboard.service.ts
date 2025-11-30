import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, ProductStatus, UserRole } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      todaySales,
      monthSales,
      yearSales,
      lowStockProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total productos activos
      this.prisma.product.count({
        where: { status: ProductStatus.PUBLISHED },
      }),
      // Total pedidos
      this.prisma.order.count(),
      // Total clientes
      this.prisma.user.count({
        where: { role: UserRole.CUSTOMER },
      }),
      // Pedidos pendientes
      this.prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      // Ventas del día
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
          status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Ventas del mes
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Ventas del año
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfYear },
          status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Productos con bajo stock
      this.prisma.product.findMany({
        where: {
          status: ProductStatus.PUBLISHED,
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
      // Pedidos recientes
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
      // Productos más vendidos
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Obtener detalles de productos más vendidos
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
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
      }),
    );

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

  async getSalesChart(params: { period: 'week' | 'month' | 'year' }) {
    const { period } = params;
    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';

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
        status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Agrupar por período
    const salesByPeriod: { [key: string]: number } = {};

    orders.forEach((order) => {
      let key: string;
      const date = new Date(order.createdAt);

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
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
}
