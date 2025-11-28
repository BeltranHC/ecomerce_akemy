import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  quantity: number;
}
