import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'El email del usuario' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'La contraseña del usuario' })
  password: string;
}