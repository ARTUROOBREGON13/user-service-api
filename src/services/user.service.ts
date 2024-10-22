import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user/create-user.dto';
import * as bcrypt from  'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = new User();
    user.nombre = createUserDto.nombre;
    user.email = createUserDto.email;
    user.rol = createUserDto.rol;
    user.password = hashedPassword;
    
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(userId: number): Promise<User> {
    const it = await this.userRepository.findOneBy({ id: userId });;
    if (!it){
      throw new NotFoundException('Usuario no encontrado');
    }
    return it;
  }
  
  async findOneByEmail(username: string): Promise<User> {
    const it = await this.userRepository.findOneBy({ email: username });
    if (!it){
      throw new NotFoundException('Usuario no encontrado');
    }
    return it;
  }

  async getUserServices(user: number) {
    const it = await this.findOne(user);
    if (!it){
      throw new NotFoundException('Usuario no encontrado');
    }
    return it.userServices;
  }
}
