import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener carrito' })
  @ApiHeader({ name: 'x-session-id', required: false })
  getCart(
    @Headers('x-session-id') sessionId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.getOrCreateCart(userId, sessionId);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('items')
  @ApiOperation({ summary: 'Agregar item al carrito' })
  @ApiHeader({ name: 'x-session-id', required: false })
  addItem(
    @Body() addToCartDto: AddToCartDto,
    @Headers('x-session-id') sessionId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.addItem(addToCartDto, userId, sessionId);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Patch('items/:id')
  @ApiOperation({ summary: 'Actualizar cantidad de item' })
  @ApiHeader({ name: 'x-session-id', required: false })
  updateItem(
    @Param('id') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
    @Headers('x-session-id') sessionId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.updateItem(itemId, updateDto, userId, sessionId);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Delete('items/:id')
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  @ApiHeader({ name: 'x-session-id', required: false })
  removeItem(
    @Param('id') itemId: string,
    @Headers('x-session-id') sessionId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.removeItem(itemId, userId, sessionId);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Vaciar carrito' })
  @ApiHeader({ name: 'x-session-id', required: false })
  clearCart(
    @Headers('x-session-id') sessionId?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Transferir carrito de sesión a usuario' })
  @ApiHeader({ name: 'x-session-id', required: true })
  transferCart(
    @Headers('x-session-id') sessionId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.cartService.transferCart(sessionId, userId);
  }
}
