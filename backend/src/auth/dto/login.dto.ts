import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@ejemplo.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'MiContraseña123!', description: 'Contraseña' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(1, { message: 'La contraseña es requerida' })
  password: string;
}
