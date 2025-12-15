import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Verificar que el usuario compró el producto (opcionalmente vía orderId)
    const hasOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: {
          userId,
          status: { in: ['PAID', 'DELIVERED', 'READY', 'PREPARING'] },
        },
      },
    });

    if (!hasOrder) {
      throw new BadRequestException('Solo puedes reseñar productos que hayas comprado');
    }

    return this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId,
        orderId: dto.orderId,
        rating: dto.rating,
        comment: dto.comment,
        status: ReviewStatus.PENDING,
      },
    });
  }

  async findApprovedByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, status: ReviewStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async listForAdmin(params: { page?: number; limit?: number; status?: ReviewStatus }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          product: { select: { name: true, sku: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Reseña no encontrada');

    return this.prisma.review.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
