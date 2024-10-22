import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserService } from '../entities/user-service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ServiceCatalog {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ description: 'Nombre del servicio', example: "Gasolina" })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Descripción del servicio', example: "Obtención y consumo de combustible" })
  @Column()
  descripcion: string;

  @ApiProperty({ description: 'Costo del servicio', example: 10.99 })
  @Column('decimal')
  costo: number;

  @ApiProperty({ description: 'Categoria del servicio', example: "Transporte" })
  @Column()
  categoria: string;

  @OneToMany(() => UserService, (userService) => userService.service)
  userServices: UserService[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
