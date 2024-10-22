import { ApiProperty } from "@nestjs/swagger";

export class ServiceResponseDto {
    @ApiProperty({ example: 1, description: 'ID único del servicio' })
    id: number;
  
    @ApiProperty({ example: 'Corte de cabello', description: 'Nombre del servicio' })
    nombre: string;
  
    @ApiProperty({ example: 'Corte de cabello profesional', description: 'Descripción del servicio' })
    descripcion: string;
  
    @ApiProperty({ example: 25.99, description: 'Costo del servicio' })
    costo: number;
  
    @ApiProperty({ example: 'Peluquería', description: 'Categoría del servicio' })
    categoria: string;
  
    @ApiProperty({ example: '2023-06-15T10:30:00Z', description: 'Fecha de creación del servicio' })
    createdAt: Date;
  
    @ApiProperty({ example: '2023-06-16T14:45:00Z', description: 'Fecha de última actualización del servicio' })
    updatedAt: Date;
  }