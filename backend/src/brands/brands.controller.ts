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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Listar marcas (tienda)' })
  findAllPublic() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener marca por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear marca' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las marcas (admin)' })
  findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.brandsService.findAll({ includeInactive });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener marca por ID' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar marca' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/Desactivar marca' })
  toggleActive(@Param('id') id: string) {
    return this.brandsService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar marca' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
