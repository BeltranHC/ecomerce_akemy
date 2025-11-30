import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva oferta' })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las ofertas (admin)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    return this.offersService.findAll({
      page,
      limit,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Obtener ofertas activas (público)' })
  getActiveOffers() {
    return this.offersService.getActiveOffers();
  }

  @Get('product/:productId/price')
  @Public()
  @ApiOperation({ summary: 'Obtener precio con oferta de un producto' })
  getProductOfferPrice(@Param('productId') productId: string) {
    return this.offersService.getProductOfferPrice(productId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalle de oferta' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Obtener oferta por slug (público)' })
  findBySlug(@Param('slug') slug: string) {
    return this.offersService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar oferta' })
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar oferta' })
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }

  @Post(':id/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar producto a oferta' })
  addProduct(
    @Param('id') offerId: string,
    @Param('productId') productId: string,
    @Body() body: { specialPrice?: number },
  ) {
    return this.offersService.addProduct(offerId, productId, body.specialPrice);
  }

  @Delete(':id/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto de oferta' })
  removeProduct(
    @Param('id') offerId: string,
    @Param('productId') productId: string,
  ) {
    return this.offersService.removeProduct(offerId, productId);
  }

  @Patch(':id/products/:productId/price')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar precio especial de producto en oferta' })
  updateProductPrice(
    @Param('id') offerId: string,
    @Param('productId') productId: string,
    @Body() body: { specialPrice: number },
  ) {
    return this.offersService.updateProductPrice(offerId, productId, body.specialPrice);
  }
}
