import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OffersModule } from '../offers/offers.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [OffersModule, CouponsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
