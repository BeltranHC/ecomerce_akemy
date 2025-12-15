import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComparisonService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, productId: string) {
    // limitar a 4 productos
    const count = await this.prisma.comparisonItem.count({ where: { userId } });
    if (count >= 4) {
      throw new BadRequestException('Máximo 4 productos en el comparador');
    }

    const exists = await this.prisma.comparisonItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (exists) return exists;

    return this.prisma.comparisonItem.create({
      data: { userId, productId },
    });
  }

  async remove(userId: string, productId: string) {
    const item = await this.prisma.comparisonItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('No está en el comparador');
    await this.prisma.comparisonItem.delete({ where: { id: item.id } });
    return { deleted: true };
  }

  async clear(userId: string) {
    await this.prisma.comparisonItem.deleteMany({ where: { userId } });
    return { cleared: true };
  }

  async list(userId: string) {
    const items = await this.prisma.comparisonItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            comparePrice: true,
            stock: true,
            sku: true,
            brand: { select: { name: true } },
            category: { select: { name: true } },
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items;
  }
}
