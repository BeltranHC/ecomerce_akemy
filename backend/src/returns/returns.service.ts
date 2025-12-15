import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnStatus } from '@prisma/client';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  private ensureWindow(deliveredAt: Date | null) {
    if (!deliveredAt) {
      throw new BadRequestException('La orden no tiene fecha de entrega registrada');
    }
    const now = new Date();
    const diffDays = (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) {
      throw new BadRequestException('La ventana de devolución de 5 días ha expirado');
    }
  }

  async requestReturn(userId: string, orderId: string, dto: CreateReturnDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    this.ensureWindow(order.deliveredAt);

    const existing = await this.prisma.returnRequest.findFirst({
      where: { orderId, userId, status: { in: [ReturnStatus.REQUESTED, ReturnStatus.APPROVED, ReturnStatus.PROCESSED] } },
    });
    if (existing) {
      throw new BadRequestException('Ya existe una solicitud de devolución activa para esta orden');
    }

    return this.prisma.returnRequest.create({
      data: {
        orderId,
        userId,
        reason: dto.reason,
        notes: dto.notes,
        refundAmount: dto.refundAmount,
        status: ReturnStatus.REQUESTED,
      },
    });
  }

  async listMyReturns(userId: string) {
    return this.prisma.returnRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAdmin(params: { status?: ReturnStatus; page?: number; limit?: number }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.returnRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { orderNumber: true, total: true, userId: true } },
          user: { select: { email: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.returnRequest.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, dto: UpdateReturnStatusDto) {
    const request = await this.prisma.returnRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitud no encontrada');

    return this.prisma.returnRequest.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes ?? request.notes,
      },
    });
  }
}
