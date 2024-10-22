import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
  
  @ApiProperty({ example: "Acueducto", description: 'Nombre del Servicio' })
  @IsString()
  nombre: string;

  @IsString()
  @ApiProperty({ example: "Consumo de Agua en el mes", description: 'Descripción del servicio' })
  descripcion: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1000, description: 'Costo del servicio' })
  costo: number;

  @IsString()
  @ApiProperty({ example: "Agua", description: 'Descripción del servicio' })
  categoria: string;
}