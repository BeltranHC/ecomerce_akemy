import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyTransactionType } from '@prisma/client';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { loyaltyPoints: true } });
    return { points: user?.loyaltyPoints ?? 0 };
  }

  async getTransactions(userId: string) {
    const txs = await this.prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return txs;
  }

  async addEarning(userId: string, points: number, reference?: string) {
    if (points <= 0) return;
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { increment: points } } }),
      this.prisma.loyaltyTransaction.create({
        data: {
          userId,
          points,
          type: LoyaltyTransactionType.EARN,
          reference,
        },
      }),
    ]);
  }
}
