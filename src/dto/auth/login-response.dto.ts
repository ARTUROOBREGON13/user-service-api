import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de acceso JWT' })
  access_token: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre del usuario' })
  userName: string;
}