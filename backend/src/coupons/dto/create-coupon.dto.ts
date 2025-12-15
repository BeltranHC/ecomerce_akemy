import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CouponType } from '@prisma/client';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CouponType, default: CouponType.PERCENTAGE })
  @IsEnum(CouponType)
  type: CouponType = CouponType.PERCENTAGE;

  @ApiProperty({ description: 'Porcentaje (0-100) o monto fijo', example: 10 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  value: number;

  @ApiProperty({ required: false, description: 'Subtotal mínimo requerido' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minSubtotal?: number;

  @ApiProperty({ required: false, description: 'Tope máximo de descuento' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxDiscount?: number;

  @ApiProperty({ required: false, description: 'Usos totales permitidos' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  maxUses?: number;

  @ApiProperty({ required: false, description: 'Usos permitidos por usuario' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  maxUsesPerUser?: number;

  @ApiProperty({ required: false, description: 'Fecha/hora de inicio ISO' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiProperty({ required: false, description: 'Fecha/hora de fin ISO' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
