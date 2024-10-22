import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  nombre: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email del usuario' })
  email: string;

  @ApiProperty({ example: 'user', description: 'Rol del usuario' })
  rol: string;
}