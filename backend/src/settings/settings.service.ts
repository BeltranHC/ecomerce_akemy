import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.storeSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async findByGroup(group: string) {
    return this.prisma.storeSetting.findMany({
      where: { group },
      orderBy: { key: 'asc' },
    });
  }

  async findByKey(key: string) {
    const setting = await this.prisma.storeSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException('Configuración no encontrada');
    }

    return setting;
  }

  async getValue(key: string): Promise<string | null> {
    const setting = await this.prisma.storeSetting.findUnique({
      where: { key },
    });

    return setting?.value || null;
  }

  async update(key: string, updateDto: UpdateSettingDto) {
    const setting = await this.prisma.storeSetting.findUnique({
      where: { key },
    });

    if (setting) {
      return this.prisma.storeSetting.update({
        where: { key },
        data: { value: updateDto.value },
      });
    }

    return this.prisma.storeSetting.create({
      data: {
        key,
        value: updateDto.value,
        type: updateDto.type || 'string',
        group: updateDto.group || 'general',
      },
    });
  }

  async updateMany(settings: { key: string; value: string }[]) {
    const results = [];

    for (const setting of settings) {
      const result = await this.update(setting.key, { value: setting.value });
      results.push(result);
    }

    return results;
  }

  async getPublicSettings() {
    const settings = await this.prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            'store_name',
            'store_description',
            'store_phone',
            'store_email',
            'store_address',
            'currency',
            'currency_symbol',
            'logo_url',
            'favicon_url',
            'shipping_cost',
            'free_shipping_min',
          ],
        },
      },
    });

    return settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
}
