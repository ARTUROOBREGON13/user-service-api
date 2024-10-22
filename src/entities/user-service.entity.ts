import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../entities/user.entity';
import { ServiceCatalog } from '../entities/service-catalog.entity';

@Entity()
export class UserService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userServices)
  user: User;

  @ManyToOne(() => ServiceCatalog, (service) => service.userServices)
  service: ServiceCatalog;

  @Column()
  status: string;

  @CreateDateColumn()
  assignedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
