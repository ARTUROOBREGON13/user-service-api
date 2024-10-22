import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserService } from '../entities/user-service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del usuario', example: ' John Doe' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'john.doe@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'user', enum: ['admin', 'user'] })
  @Column({ default: 'user' })
  rol: string;

  @OneToMany(() => UserService, (userService) => userService.user)
  userServices: UserService[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
