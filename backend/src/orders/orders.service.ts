import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, MovementType } from '@prisma/client';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let addressId = createOrderDto.addressId;

    // Si se proporciona una dirección inline, crearla
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

    // Si aún no hay dirección, buscar la dirección por defecto del usuario
    if (!addressId) {
      const defaultAddress = await this.prisma.address.findFirst({
        where: { userId, isDefault: true },
      });
      
      if (!defaultAddress) {
        throw new BadRequestException('Se requiere una dirección de envío');
      }
      addressId = defaultAddress.id;
    }

    // Verificar que la dirección existe y pertenece al usuario
    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new BadRequestException('Dirección no encontrada');
    }

    // Obtener items del carrito si useCart es true o no hay items
    let items = createOrderDto.items;
    
    if ((!items || items.length === 0) || createOrderDto.useCart) {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('El carrito está vacío');
      }

      items = cart.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      }));
    }
    
    if (!items || items.length === 0) {
      throw new BadRequestException('El pedido debe tener al menos un producto');
    }

    // Verificar stock y calcular totales
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new BadRequestException(`Producto ${item.productId} no encontrado`);
      }

      let price = Number(product.price);
      let stock = product.stock;

      // Si tiene variante
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          throw new BadRequestException(`Variante ${item.variantId} no encontrada`);
        }
        if (variant.price) {
          price = Number(variant.price);
        }
        stock = variant.stock;
      }

      if (stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para ${product.name}`);
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

    // Calcular envío
    const shippingCost = createOrderDto.shippingCost || 0;
    const discount = createOrderDto.discount || 0;
    const total = subtotal + shippingCost - discount;

    // Generar número de orden
    const orderNumber = await this.generateOrderNumber();

    // Crear orden
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

    // Descontar stock
    for (const item of orderItems) {
      await this.productsService.updateStock(
        item.productId,
        -item.quantity,
        MovementType.SALE,
        `Venta - Orden ${orderNumber}`,
        userId,
      );
    }

    // Vaciar el carrito del usuario
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

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const { status, userId, startDate, endDate, search } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
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

  async findOne(id: string) {
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
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
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
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, adminId?: string) {
    const order = await this.findOne(id);

    const updateData: any = {
      status: updateStatusDto.status,
    };

    // Actualizar timestamps según el estado
    switch (updateStatusDto.status) {
      case OrderStatus.PAID:
        updateData.paidAt = new Date();
        break;
      case OrderStatus.SHIPPED:
        updateData.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        updateData.cancellationReason = updateStatusDto.reason;
        
        // Devolver stock si se cancela
        for (const item of order.items) {
          await this.productsService.updateStock(
            item.productId,
            item.quantity,
            MovementType.RETURN,
            `Cancelación - Orden ${order.orderNumber}`,
            adminId,
          );
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

    // Crear log de auditoría
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

  // Obtener pedidos de un cliente
  async getCustomerOrders(userId: string, params: { page?: number; limit?: number }) {
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

  // Estadísticas de ventas
  async getSalesStats(params: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = params;

    const where: any = {
      status: {
        in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
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

    // Agrupar ventas por día
    const salesByDay = orders.reduce((acc: any, order) => {
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

  // Generar número de orden
  private async generateOrderNumber(): Promise<string> {
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
}
