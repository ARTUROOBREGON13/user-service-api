import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'El nombre del usuario',
    example: 'John Doe'
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'El rol del usuario',
    example: 'user',
    enum: ['admin', 'user']
  })
  @IsEnum(['admin', 'user'])
  rol: 'admin' | 'user';
}