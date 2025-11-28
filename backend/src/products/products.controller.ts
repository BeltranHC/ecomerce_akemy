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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole, ProductStatus } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Rutas públicas
  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Listar productos (tienda)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false })
  findAllPublished(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') categorySlug?: string,
    @Query('brand') brandSlug?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.findAllPublished({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      categorySlug,
      brandSlug,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Productos destacados' })
  getFeatured(@Query('limit') limit?: string) {
    return this.productsService.getFeatured(limit ? parseInt(limit, 10) : undefined);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Buscar producto por SKU o código de barra' })
  search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener producto por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Productos relacionados' })
  getRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.productsService.getRelated(id, limit ? parseInt(limit, 10) : undefined);
  }

  // Rutas admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear producto' })
  create(@Body() createProductDto: CreateProductDto, @CurrentUser('sub') userId: string) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los productos (admin)' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('status') status?: ProductStatus,
    @Query('isFeatured') isFeatured?: string,
    @Query('inStock') inStock?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      categoryId,
      brandId,
      status,
      isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Productos con bajo stock' })
  getLowStock(@Query('threshold') threshold?: string) {
    return this.productsService.getLowStock(threshold ? parseInt(threshold, 10) : undefined);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar stock' })
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.productsService.updateStock(
      id,
      updateStockDto.quantity,
      updateStockDto.type,
      updateStockDto.notes,
      userId,
    );
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar imagen a producto' })
  addImage(
    @Param('id') id: string,
    @Body() imageData: { url: string; alt?: string; isPrimary?: boolean },
  ) {
    return this.productsService.addImage(id, imageData);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar imagen' })
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(imageId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
