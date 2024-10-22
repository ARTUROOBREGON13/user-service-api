import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Nombre del servicio' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción del servicio' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Costo del servicio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo?: number;

  @ApiPropertyOptional({ description: 'Categoría del servicio' })
  @IsOptional()
  @IsString()
  categoria?: string;
}