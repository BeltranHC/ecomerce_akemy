import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor() {
    // Crear directorio de uploads si no existe
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
    
    // Crear subdirectorios
    const subdirs = ['products', 'banners', 'categories', 'brands', 'users'];
    subdirs.forEach((dir) => {
      const path = join(this.uploadPath, dir);
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    });
  }

  async uploadImage(
    file: UploadedFile,
    folder: 'products' | 'banners' | 'categories' | 'brands' | 'users',
  ): Promise<{ url: string; filename: string }> {
    this.validateImage(file);

    const ext = extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const filePath = join(this.uploadPath, folder, filename);

    writeFileSync(filePath, file.buffer);

    const url = `/uploads/${folder}/${filename}`;

    return { url, filename };
  }

  async uploadImages(
    files: UploadedFile[],
    folder: 'products' | 'banners' | 'categories' | 'brands' | 'users',
  ): Promise<Array<{ url: string; filename: string }>> {
    const results: Array<{ url: string; filename: string }> = [];

    for (const file of files) {
      const result = await this.uploadImage(file, folder);
      results.push(result);
    }

    return results;
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      // Extraer el path del URL
      const relativePath = url.replace('/uploads/', '');
      const filePath = join(this.uploadPath, relativePath);

      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return false;
    }
  }

  private validateImage(file: UploadedFile): void {
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Solo se aceptan: ${this.allowedImageTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `El archivo es muy grande. Tamaño máximo: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  getFilePath(url: string): string {
    const relativePath = url.replace('/uploads/', '');
    return join(this.uploadPath, relativePath);
  }

  fileExists(url: string): boolean {
    const filePath = this.getFilePath(url);
    return existsSync(filePath);
  }
}
