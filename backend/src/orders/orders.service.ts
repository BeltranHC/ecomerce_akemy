import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, MovementType, PaymentStatus } from '@prisma/client';
import { ProductsService } from '../products/products.service';
import { ChatGateway } from '../chat/chat.gateway';
import { CouponsService } from '../coupons/coupons.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private couponsService: CouponsService,
    private loyaltyService: LoyaltyService,
    private mailService: MailService,
    @Optional() @Inject(forwardRef(() => ChatGateway))
    private chatGateway?: ChatGateway,
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!userProfile) {
      throw new BadRequestException('Usuario no encontrado');
    }

    let addressId = createOrderDto.addressId;
    const baseAddressData = {
      userId,
      label: 'Recojo en tienda',
      recipientName: `${createOrderDto.shippingAddress?.firstName || userProfile.firstName} ${createOrderDto.shippingAddress?.lastName || userProfile.lastName}`.trim(),
      phone: createOrderDto.shippingAddress?.phone || userProfile.phone || '000000000',
      street: createOrderDto.shippingAddress?.address || 'Recojo en tienda',
      number: '',
      district: createOrderDto.shippingAddress?.district || 'Tienda AKEMY',
      city: createOrderDto.shippingAddress?.city || 'Lima',
      province: createOrderDto.shippingAddress?.city || 'Lima',
      department: createOrderDto.shippingAddress?.city || 'Lima',
      postalCode: createOrderDto.shippingAddress?.postalCode || '',
      isDefault: true,
    };

    // Resolver dirección sin obligar al usuario a gestionarlas manualmente
    let address = null;

    if (addressId) {
      address = await this.prisma.address.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });
    }

    if (!address && createOrderDto.shippingAddress) {
      // Si envían datos inline, reusar o crear un perfil de recojo
      const pickupAddress = await this.prisma.address.findFirst({
        where: {
          userId,
          label: 'Recojo en tienda',
        },
      });

      if (pickupAddress) {
        address = pickupAddress;
      } else {
        address = await this.prisma.address.create({ data: baseAddressData });
      }
    }

    if (!address) {
      // Último recurso: aseguramos una dirección de recojo para cumplir con el esquema
      const pickupAddress = await this.prisma.address.findFirst({
        where: { userId, label: 'Recojo en tienda' },
      });

      if (pickupAddress) {
        address = pickupAddress;
      } else {
        address = await this.prisma.address.create({ data: baseAddressData });
      }
    }

    addressId = address.id;

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

    const shippingCost = createOrderDto.shippingCost || 0;

    let couponDiscount = 0;
    let couponId: string | undefined;
    let couponCode: string | undefined;

    if (createOrderDto.couponCode) {
      const validation = await this.couponsService.validateCoupon(
        createOrderDto.couponCode,
        userId,
        subtotal,
      );
      couponDiscount = validation.discount;
      couponId = validation.coupon.id;
      couponCode = validation.coupon.code;
    }

    const discount = couponDiscount;
    const total = Math.max(subtotal + shippingCost - discount, 0);
    const paymentMethod = createOrderDto.paymentMethod || 'YAPE_QR';
    const paymentStatus = paymentMethod === 'CASH_ON_DELIVERY' ? PaymentStatus.PENDING : PaymentStatus.PENDING;

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
        couponId,
        couponCode,
        total,
        paymentMethod,
        paymentStatus,
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
            phone: true,
          },
        },
      },
    });

    if (couponId) {
      await this.couponsService.registerRedemption(couponId, userId, order.id);
    }

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

    // Notificar al cliente
    if (order.user?.email) {
      const itemsForEmail = order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const shippingAddressText = `${order.address.street}, ${order.address.district}, ${order.address.city}`;

      try {
        await this.mailService.sendOrderConfirmationEmail(order.user.email, {
          orderNumber: order.orderNumber,
          items: itemsForEmail,
          subtotal: Number(order.subtotal),
          tax: 0,
          shipping: Number(order.shippingCost),
          total: Number(order.total),
          shippingAddress: shippingAddressText,
        });

        await this.mailService.sendOrderStatusUpdateEmail(
          order.user.email,
          order.orderNumber,
          OrderStatus.PENDING,
          'Hemos recibido tu pedido',
        );
      } catch (error) {
        // Evitar que un fallo de email bloquee el flujo de compra
        console.warn('No se pudo enviar el correo de confirmación/status', error?.message || error);
      }
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

  async markAsPaid(id: string, adminId?: string) {
    const order = await this.findOne(id);

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PAID,
        paidAt: order.paidAt || new Date(),
      },
    });

    // Registrar puntos: 1 punto por unidad monetaria del total
    const points = Math.floor(Number(updated.total));
    if (points > 0) {
      await this.loyaltyService.addEarning(updated.userId, points, `ORDER:${updated.orderNumber}`);
    }

    // Crear log de auditoría
    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'STATUS_CHANGE',
        entity: 'Order',
        entityId: id,
        oldValues: { paymentStatus: order.paymentStatus, status: order.status },
        newValues: { paymentStatus: updated.paymentStatus, status: updated.status },
      },
    });

    return updated;
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
        updateData.paymentStatus = PaymentStatus.PAID;
        break;
      case OrderStatus.READY:
        updateData.shippedAt = new Date(); // Reutilizamos shippedAt para readyAt
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

    // Si marcamos como pagado desde aquí, otorgar puntos (1 punto por unidad monetaria)
    if (updateStatusDto.status === OrderStatus.PAID) {
      const points = Math.floor(Number(updatedOrder.total));
      if (points > 0) {
        await this.loyaltyService.addEarning(updatedOrder.user.id, points, `ORDER:${updatedOrder.orderNumber}`);
      }
    }

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

    // Enviar notificación en tiempo real al cliente
    if (updatedOrder.user && this.chatGateway) {
      const statusMessages: Record<string, string> = {
        PAID: '✅ Tu pago ha sido confirmado. Estamos preparando tu pedido.',
        PREPARING: '📦 Estamos preparando tu pedido.',
        READY: '🎉 ¡Tu pedido está listo para recoger! Puedes pasar a la tienda.',
        DELIVERED: '✅ Pedido entregado. ¡Gracias por tu compra!',
        CANCELLED: '❌ Tu pedido ha sido cancelado.',
      };

      const message = statusMessages[updateStatusDto.status] || 'El estado de tu pedido ha sido actualizado.';

      // Enviar notificación WebSocket
      if (updateStatusDto.status === OrderStatus.READY) {
        await this.chatGateway.sendOrderReadyNotification(
          updatedOrder.user.id,
          updatedOrder.orderNumber,
        );
      } else {
        await this.chatGateway.sendOrderStatusNotification(
          updatedOrder.user.id,
          updatedOrder.orderNumber,
          updateStatusDto.status,
          message,
        );
      }
    }

    // Enviar notificación por email
    if (updatedOrder.user?.email) {
      const statusMessages: Record<string, string> = {
        PENDING: 'Hemos recibido tu pedido',
        PAID: 'Tu pago ha sido confirmado',
        PREPARING: 'Estamos preparando tu pedido',
        READY: '¡Tu pedido está listo para recoger!',
        DELIVERED: 'Pedido entregado',
        CANCELLED: 'Tu pedido ha sido cancelado',
      };

      const message = statusMessages[updateStatusDto.status] || 'El estado de tu pedido ha sido actualizado';

      await this.mailService.sendOrderStatusUpdateEmail(
        updatedOrder.user.email,
        updatedOrder.orderNumber,
        updateStatusDto.status,
        message,
      );
    }

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
        in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED],
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
