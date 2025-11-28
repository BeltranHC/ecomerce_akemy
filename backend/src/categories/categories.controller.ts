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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Rutas públicas
  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Listar categorías (tienda)' })
  findAllPublic() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get('menu')
  @ApiOperation({ summary: 'Categorías para menú' })
  getMainCategories() {
    return this.categoriesService.getMainCategories();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener categoría por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // Rutas admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear categoría' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las categorías (admin)' })
  findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAll({ includeInactive });
  }

  @Get('flat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar categorías en lista plana' })
  findAllFlat(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAllFlat({ includeInactive });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar categoría' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/Desactivar categoría' })
  toggleActive(@Param('id') id: string) {
    return this.categoriesService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar categoría' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
