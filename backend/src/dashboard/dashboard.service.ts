import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, ProductStatus, UserRole } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

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

  // Carritos abandonados (carritos con items que no se convirtieron en órdenes en las últimas 48 horas)
  async getAbandonedCarts() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const abandonedCarts = await this.prisma.cart.findMany({
      where: {
        updatedAt: {
          gte: twoDaysAgo,
        },
        items: {
          some: {},
        },
        user: {
          orders: {
            none: {
              createdAt: {
                gte: twoDaysAgo,
              },
            },
          },
        },
      },
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
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 20,
    });

    return abandonedCarts.map((cart) => {
      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      return {
        id: cart.id,
        user: cart.user,
        itemCount: cart.items.length,
        total,
        lastActivity: cart.updatedAt,
        items: cart.items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: Number(item.product.price),
        })),
      };
    });
  }

  // Tendencias de ventas comparando con período anterior
  async getSalesTrends() {
    const now = new Date();

    // Períodos actuales
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const paidStatuses = [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED];

    const [
      todaySales,
      yesterdaySales,
      thisWeekSales,
      lastWeekSales,
      thisMonthSales,
      lastMonthSales,
      todayOrders,
      yesterdayOrders,
      thisMonthCustomers,
      lastMonthCustomers,
    ] = await Promise.all([
      // Ventas hoy
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: todayStart },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Ventas ayer
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: yesterdayStart, lt: todayStart },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Ventas esta semana
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: thisWeekStart },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Ventas semana pasada
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: lastWeekStart, lt: lastWeekEnd },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Ventas este mes
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: thisMonthStart },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Ventas mes pasado
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: { in: paidStatuses },
        },
        _sum: { total: true },
      }),
      // Pedidos hoy
      this.prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      // Pedidos ayer
      this.prisma.order.count({
        where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
      }),
      // Nuevos clientes este mes
      this.prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          createdAt: { gte: thisMonthStart },
        },
      }),
      // Nuevos clientes mes pasado
      this.prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
    ]);

    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      daily: {
        sales: Number(todaySales._sum.total || 0),
        previousSales: Number(yesterdaySales._sum.total || 0),
        change: calculateChange(
          Number(todaySales._sum.total || 0),
          Number(yesterdaySales._sum.total || 0)
        ),
        orders: todayOrders,
        previousOrders: yesterdayOrders,
        ordersChange: calculateChange(todayOrders, yesterdayOrders),
      },
      weekly: {
        sales: Number(thisWeekSales._sum.total || 0),
        previousSales: Number(lastWeekSales._sum.total || 0),
        change: calculateChange(
          Number(thisWeekSales._sum.total || 0),
          Number(lastWeekSales._sum.total || 0)
        ),
      },
      monthly: {
        sales: Number(thisMonthSales._sum.total || 0),
        previousSales: Number(lastMonthSales._sum.total || 0),
        change: calculateChange(
          Number(thisMonthSales._sum.total || 0),
          Number(lastMonthSales._sum.total || 0)
        ),
        newCustomers: thisMonthCustomers,
        previousNewCustomers: lastMonthCustomers,
        customersChange: calculateChange(thisMonthCustomers, lastMonthCustomers),
      },
    };
  }

  // Rendimiento por categoría
  async getCategoryPerformance() {
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const categoryStats = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: thisMonthStart },
          status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
    });

    // Obtener productos con sus categorías
    const productIds = categoryStats.map((s) => s.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Agrupar por categoría
    const categoryMap: Record<string, { name: string; totalSales: number; itemsSold: number }> = {};

    categoryStats.forEach((stat) => {
      const product = products.find((p) => p.id === stat.productId);
      if (product && product.category) {
        const catId = product.category.id;
        if (!categoryMap[catId]) {
          categoryMap[catId] = {
            name: product.category.name,
            totalSales: 0,
            itemsSold: 0,
          };
        }
        categoryMap[catId].totalSales += Number(stat._sum.total || 0);
        categoryMap[catId].itemsSold += stat._sum.quantity || 0;
      }
    });

    return Object.entries(categoryMap)
      .map(([id, data]) => ({
        id,
        ...data,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }

  // Métricas de clientes
  async getCustomerMetrics() {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalCustomers,
      newCustomersThisMonth,
      customersWithOrders,
      repeatCustomers,
      topCustomers,
    ] = await Promise.all([
      // Total clientes
      this.prisma.user.count({
        where: { role: UserRole.CUSTOMER },
      }),
      // Nuevos clientes este mes
      this.prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          createdAt: { gte: thisMonthStart },
        },
      }),
      // Clientes con al menos una orden
      this.prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          orders: { some: {} },
        },
      }),
      // Clientes con más de una orden (recurrentes)
      this.prisma.user.findMany({
        where: {
          role: UserRole.CUSTOMER,
        },
        select: {
          id: true,
          _count: {
            select: { orders: true },
          },
        },
      }),
      // Top 5 clientes por valor de órdenes
      this.prisma.user.findMany({
        where: {
          role: UserRole.CUSTOMER,
          orders: { some: {} },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          orders: {
            where: {
              status: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED] },
            },
            select: {
              total: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    const repeatCustomerCount = repeatCustomers.filter((c) => c._count.orders > 1).length;

    // Calcular top clientes por valor total
    const topCustomersWithTotal = topCustomers
      .map((customer) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        totalSpent: customer.orders.reduce((sum, o) => sum + Number(o.total), 0),
        orderCount: customer.orders.length,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      totalCustomers,
      newCustomersThisMonth,
      customersWithOrders,
      repeatCustomers: repeatCustomerCount,
      conversionRate: totalCustomers > 0
        ? Math.round((customersWithOrders / totalCustomers) * 100)
        : 0,
      retentionRate: customersWithOrders > 0
        ? Math.round((repeatCustomerCount / customersWithOrders) * 100)
        : 0,
      topCustomers: topCustomersWithTotal,
    };
  }
}
