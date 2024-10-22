import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'El nombre del usuario',
    example: 'John Doe',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
