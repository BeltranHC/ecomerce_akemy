import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
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
export class UploadService implements OnModuleInit {
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
  private readonly useCloudinary: boolean;

  constructor(private configService: ConfigService) {
    // Configurar Cloudinary si hay credenciales
    // Opción 1: CLOUDINARY_URL (formato: cloudinary://api_key:api_secret@cloud_name)
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');

    // Opción 2: Variables individuales
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudinaryUrl) {
      // Usar CLOUDINARY_URL directamente
      cloudinary.config({ url: cloudinaryUrl, secure: true });
      this.useCloudinary = true;
      console.log('☁️ Cloudinary configurado con CLOUDINARY_URL');
    } else if (cloudName && apiKey && apiSecret) {
      // Usar variables individuales
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.useCloudinary = true;
      console.log('☁️ Cloudinary configurado con credenciales individuales');
      console.log('   Cloud Name:', cloudName);
    } else {
      this.useCloudinary = false;
      console.log('📁 Usando almacenamiento local para imágenes');
      this.initLocalStorage();
    }
  }

  onModuleInit() {
    console.log('=== UploadService Inicializado ===');
    console.log('Cloudinary habilitado:', this.useCloudinary);
    if (this.useCloudinary) {
      console.log('☁️ Cloudinary listo para recibir imágenes');
    }
  }

  private initLocalStorage() {
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
  ): Promise<{ url: string; filename: string; publicId?: string }> {
    this.validateImage(file);

    if (this.useCloudinary) {
      return this.uploadToCloudinary(file, folder);
    } else {
      return this.uploadToLocal(file, folder);
    }
  }

  private async uploadToCloudinary(
    file: UploadedFile,
    folder: string,
  ): Promise<{ url: string; filename: string; publicId: string }> {
    try {
      // Convertir buffer a base64 data URI
      const base64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      // Subir usando la API de Cloudinary (sin transformaciones para evitar problemas de firma)
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: `akemy/${folder}`,
        resource_type: 'auto',
      });

      return {
        url: result.secure_url,
        filename: result.public_id.split('/').pop() || result.public_id,
        publicId: result.public_id,
      };
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error, ', erroresss');
      throw new BadRequestException('Error al subir imagen a Cloudinary: ' + (error?.message || 'Unknown error'));
    }
  }

  private async uploadToLocal(
    file: UploadedFile,
    folder: string,
  ): Promise<{ url: string; filename: string }> {
    const ext = extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const filePath = join(this.uploadPath, folder, filename);

    writeFileSync(filePath, file.buffer);

    // Construir URL completa
    const baseUrl = this.configService.get<string>('BACKEND_URL')
      || this.configService.get<string>('API_URL')
      || 'http://localhost:3001';
    const relativePath = `/uploads/${folder}/${filename}`;
    const url = `${baseUrl}${relativePath}`;

    return { url, filename };
  }

  async uploadImages(
    files: UploadedFile[],
    folder: 'products' | 'banners' | 'categories' | 'brands' | 'users',
  ): Promise<Array<{ url: string; filename: string; publicId?: string }>> {
    const results: Array<{ url: string; filename: string; publicId?: string }> = [];

    for (const file of files) {
      const result = await this.uploadImage(file, folder);
      results.push(result);
    }

    return results;
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      if (this.useCloudinary && url.includes('cloudinary.com')) {
        // Extraer public_id de la URL de Cloudinary
        const matches = url.match(/\/akemy\/([^/]+)\/([^.]+)/);
        if (matches) {
          const publicId = `akemy/${matches[1]}/${matches[2]}`;
          await cloudinary.uploader.destroy(publicId);
          return true;
        }
        return false;
      } else {
        // Eliminar archivo local
        const relativePath = url.replace('/uploads/', '');
        const filePath = join(this.uploadPath, relativePath);

        if (existsSync(filePath)) {
          unlinkSync(filePath);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return false;
    }
  }

  private validateImage(file: UploadedFile): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!file.buffer) {
      throw new BadRequestException('El archivo no tiene contenido');
    }

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
    if (url.includes('cloudinary.com')) {
      return true; // Cloudinary siempre disponible
    }
    const filePath = this.getFilePath(url);
    return existsSync(filePath);
  }
}
