import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateStockDto {
  @ApiProperty({ example: 10, description: 'Cantidad (positivo para entrada, negativo para salida)' })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
