import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'LAP-001' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku: string;

  @ApiProperty({ example: '7501234567890', required: false })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 'Lápiz Faber-Castell 2B' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'lapiz-faber-castell-2b' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @ApiProperty({ example: 'Lápiz de grafito profesional', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Lápiz profesional 2B', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortDescription?: string;

  @ApiProperty({ example: 2.50 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({ example: 3.00, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  comparePrice?: number;

  @ApiProperty({ example: 1.50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  costPrice?: number;

  @ApiProperty({ example: 100, default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock?: number;

  @ApiProperty({ example: 5, default: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  lowStockAlert?: number;

  @ApiProperty({ example: 0.05, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  weight?: number;

  @ApiProperty({ description: 'ID de la categoría' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'ID de la marca', required: false })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({ enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;
}
