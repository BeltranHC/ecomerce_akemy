import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  private normalizeCode(code: string) {
    return code.trim().toUpperCase();
  }

  async create(dto: CreateCouponDto) {
    const code = this.normalizeCode(dto.code);

    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new BadRequestException('Ya existe un cupón con ese código');
    }

    return this.prisma.coupon.create({
      data: {
        code,
        description: dto.description,
        type: dto.type,
        value: dto.value,
        minSubtotal: dto.minSubtotal,
        maxDiscount: dto.maxDiscount,
        maxUses: dto.maxUses,
        maxUsesPerUser: dto.maxUsesPerUser,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; active?: boolean }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.active !== undefined) where.isActive = params.active;
    if (params.search) where.code = { contains: params.search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Cupón no encontrado');
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    const code = dto.code ? this.normalizeCode(dto.code) : coupon.code;

    if (dto.code && code !== coupon.code) {
      const existing = await this.prisma.coupon.findUnique({ where: { code } });
      if (existing) {
        throw new BadRequestException('Ya existe un cupón con ese código');
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: {
        code,
        description: dto.description,
        type: dto.type ?? coupon.type,
        value: dto.value ?? coupon.value,
        minSubtotal: dto.minSubtotal,
        maxDiscount: dto.maxDiscount,
        maxUses: dto.maxUses,
        maxUsesPerUser: dto.maxUsesPerUser,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        isActive: dto.isActive ?? coupon.isActive,
      },
    });
  }

  async validateCoupon(codeInput: string, userId: string | undefined, subtotal: number) {
    const code = this.normalizeCode(codeInput);
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon) throw new BadRequestException('Cupón no válido');
    if (!coupon.isActive) throw new BadRequestException('Cupón inactivo');

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) throw new BadRequestException('Cupón aún no está vigente');
    if (coupon.endsAt && coupon.endsAt < now) throw new BadRequestException('El cupón expiró');

    if (coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('El cupón alcanzó el límite de usos');
    }

    if (coupon.minSubtotal && subtotal < Number(coupon.minSubtotal)) {
      throw new BadRequestException('No se alcanza el subtotal mínimo para el cupón');
    }

    if (coupon.maxUsesPerUser && userId) {
      const userUses = await this.prisma.couponRedemption.count({
        where: { couponId: coupon.id, userId },
      });
      if (userUses >= coupon.maxUsesPerUser) {
        throw new BadRequestException('Has alcanzado el límite de usos de este cupón');
      }
    }

    let discount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
      discount = subtotal * (Number(coupon.value) / 100);
    } else {
      discount = Number(coupon.value);
    }

    if (coupon.maxDiscount) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }

    discount = Math.min(discount, subtotal);
    discount = Number(discount.toFixed(2));

    const totalAfterDiscount = Math.max(subtotal - discount, 0);

    return {
      coupon,
      discount,
      totalAfterDiscount,
    };
  }

  async registerRedemption(couponId: string, userId: string, orderId: string) {
    await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      }),
      this.prisma.couponRedemption.create({
        data: {
          couponId,
          userId,
          orderId,
        },
      }),
    ]);
  }
}
