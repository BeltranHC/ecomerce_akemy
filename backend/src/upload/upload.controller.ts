import {
  Controller,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    return this.uploadService.uploadImage(file as any, 'products');
  }

  @Post('products')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Subir múltiples imágenes de productos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imágenes subidas exitosamente' })
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos');
    }
    return this.uploadService.uploadImages(files as any, 'products');
  }

  @Post('banner')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de banner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  async uploadBannerImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    return this.uploadService.uploadImage(file as any, 'banners');
  }

  @Post('category')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de categoría' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  async uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    return this.uploadService.uploadImage(file as any, 'categories');
  }

  @Post('brand')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  async uploadBrandImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    return this.uploadService.uploadImage(file as any, 'brands');
  }

  @Delete(':folder/:filename')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.PRODUCT_MANAGER, UserRole.EDITOR)
  @ApiOperation({ summary: 'Eliminar imagen' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente' })
  async deleteImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
  ) {
    const url = `/uploads/${folder}/${filename}`;
    const deleted = await this.uploadService.deleteImage(url);
    
    if (!deleted) {
      throw new BadRequestException('No se pudo eliminar la imagen');
    }
    
    return { message: 'Imagen eliminada exitosamente' };
  }
}
