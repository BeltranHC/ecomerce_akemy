import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsString({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @ApiProperty({ example: 'NuevaContraseña123!', description: 'Nueva contraseña' })
  @IsString({ message: 'La nueva contraseña debe ser texto' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  newPassword: string;
}
