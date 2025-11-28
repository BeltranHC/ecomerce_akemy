import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser('sub') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Get('ids')
  async getWishlistIds(@CurrentUser('sub') userId: string) {
    return this.wishlistService.getWishlistIds(userId);
  }

  @Get('count')
  async getWishlistCount(@CurrentUser('sub') userId: string) {
    return { count: await this.wishlistService.getWishlistCount(userId) };
  }

  @Get('check/:productId')
  async isInWishlist(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    const isInWishlist = await this.wishlistService.isInWishlist(userId, productId);
    return { isInWishlist };
  }

  @Post(':productId')
  async addToWishlist(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Post('toggle/:productId')
  @HttpCode(HttpStatus.OK)
  async toggleWishlist(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.toggleWishlist(userId, productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWishlist(@CurrentUser('sub') userId: string) {
    await this.wishlistService.clearWishlist(userId);
    return { message: 'Lista de deseos vaciada' };
  }
}
