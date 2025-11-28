import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: createBannerDto,
    });
  }

  async findAll(params: { includeInactive?: boolean } = {}) {
    const where: any = {};

    if (!params.includeInactive) {
      where.isActive = true;

      // Filtrar por fecha
      const now = new Date();
      where.OR = [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ];
    }

    return this.prisma.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner no encontrado');
    }

    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id);

    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.banner.delete({
      where: { id },
    });

    return { message: 'Banner eliminado exitosamente' };
  }

  async toggleActive(id: string) {
    const banner = await this.findOne(id);

    return this.prisma.banner.update({
      where: { id },
      data: { isActive: !banner.isActive },
    });
  }

  async getActiveBanners() {
    const now = new Date();

    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
