import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Obtener o crear carrito
  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('Se requiere userId o sessionId');
    }

    let cart;

    if (userId) {
      cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  comparePrice: true,
                  stock: true,
                  status: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    comparePrice: true,
                    stock: true,
                    status: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
                variant: true,
              },
            },
          },
        });
      }
    } else if (sessionId) {
      cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  comparePrice: true,
                  stock: true,
                  status: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { sessionId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    comparePrice: true,
                    stock: true,
                    status: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
                variant: true,
              },
            },
          },
        });
      }
    }

    return this.calculateCartTotals(cart);
  }

  // Agregar item al carrito
  async addItem(addToCartDto: AddToCartDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Verificar producto
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
      include: { variants: true },
    });

    if (!product || product.status !== 'PUBLISHED') {
      throw new BadRequestException('Producto no disponible');
    }

    let stock = product.stock;

    // Verificar variante si existe
    if (addToCartDto.variantId) {
      const variant = product.variants.find(v => v.id === addToCartDto.variantId);
      if (!variant || !variant.isActive) {
        throw new BadRequestException('Variante no disponible');
      }
      stock = variant.stock;
    }

    // Verificar si ya está en el carrito
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
        variantId: addToCartDto.variantId || null,
      },
    });

    const newQuantity = existingItem 
      ? existingItem.quantity + addToCartDto.quantity 
      : addToCartDto.quantity;

    if (newQuantity > stock) {
      throw new BadRequestException('Stock insuficiente');
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          variantId: addToCartDto.variantId,
          quantity: addToCartDto.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  // Actualizar cantidad de item
  async updateItem(itemId: string, updateDto: UpdateCartItemDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: {
          include: { variants: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    let stock = item.product.stock;
    if (item.variantId) {
      const variant = item.product.variants.find(v => v.id === item.variantId);
      stock = variant?.stock || 0;
    }

    if (updateDto.quantity > stock) {
      throw new BadRequestException('Stock insuficiente');
    }

    if (updateDto.quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: updateDto.quantity },
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  // Eliminar item del carrito
  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  // Vaciar carrito
  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  // Transferir carrito de sesión a usuario
  async transferCart(sessionId: string, userId: string) {
    const sessionCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart || sessionCart.items.length === 0) {
      return this.getOrCreateCart(userId);
    }

    let userCart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!userCart) {
      userCart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Transferir items
    for (const item of sessionCart.items) {
      const existingItem = userCart.items.find(
        i => i.productId === item.productId && i.variantId === item.variantId,
      );

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Eliminar carrito de sesión
    await this.prisma.cart.delete({
      where: { id: sessionCart.id },
    });

    return this.getOrCreateCart(userId);
  }

  // Calcular totales del carrito
  private calculateCartTotals(cart: any) {
    let subtotal = 0;
    let totalItems = 0;

    const items = cart.items.map((item: any) => {
      const price = item.variant?.price 
        ? Number(item.variant.price) 
        : Number(item.product.price);
      
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      return {
        ...item,
        price,
        total: itemTotal,
      };
    });

    return {
      id: cart.id,
      items,
      subtotal,
      totalItems,
    };
  }
}
