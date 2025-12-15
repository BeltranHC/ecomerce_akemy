import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ required: false, description: 'Subtotal para cálculo de descuento' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  subtotal?: number;
}
