import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignServiceUserDto {
  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID del usuario a vincular con el servicio' })
  user: number;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID del servicio a vincular con el usuario' })
  service: number;
}