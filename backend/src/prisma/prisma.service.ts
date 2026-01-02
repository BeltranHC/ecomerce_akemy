import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('No se puede limpiar la base de datos en producción');
    }
    
    // Orden específico para respetar foreign keys
    const models = [
      'auditLog',
      'inventoryMovement',
      'orderItem',
      'order',
      'cartItem',
      'cart',
      'productVariant',
      'productImage',
      'product',
      'category',
      'brand',
      'address',
      'passwordResetToken',
      'verificationToken',
      'user',
      'storeSetting',
      'banner',
    ];

    for (const model of models) {
      await (this as any)[model].deleteMany();
    }
  }
}
