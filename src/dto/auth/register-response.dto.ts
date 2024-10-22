import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 1, description: 'ID del usuario registrado' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email del usuario' })
  email: string; }
