import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
            brand: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return wishlists.map(w => w.product);
  }

  async getWishlistIds(userId: string) {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });

    return wishlists.map(w => w.productId);
  }

  async addToWishlist(userId: string, productId: string) {
    // Verificar que el producto exista
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar si ya está en la lista de deseos
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw new ConflictException('El producto ya está en tu lista de deseos');
    }

    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
            brand: true,
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!wishlist) {
      throw new NotFoundException('El producto no está en tu lista de deseos');
    }

    return this.prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async toggleWishlist(userId: string, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await this.prisma.wishlist.delete({
        where: {
          userId_productId: { userId, productId },
        },
      });
      return { added: false, message: 'Producto eliminado de tu lista de deseos' };
    }

    // Verificar que el producto exista
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.prisma.wishlist.create({
      data: { userId, productId },
    });

    return { added: true, message: 'Producto agregado a tu lista de deseos' };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return !!wishlist;
  }

  async clearWishlist(userId: string) {
    return this.prisma.wishlist.deleteMany({
      where: { userId },
    });
  }

  async getWishlistCount(userId: string): Promise<number> {
    return this.prisma.wishlist.count({
      where: { userId },
    });
  }
}
