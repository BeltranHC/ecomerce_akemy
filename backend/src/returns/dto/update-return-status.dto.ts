import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReturnStatus } from '@prisma/client';

export class UpdateReturnStatusDto {
  @ApiProperty({ enum: ReturnStatus })
  @IsEnum(ReturnStatus)
  status: ReturnStatus;

  @ApiProperty({ required: false, description: 'Notas de resolución' })
  @IsOptional()
  @IsString()
  notes?: string;
}
