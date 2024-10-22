import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../entities/user-service.entity';
import { User } from '../entities/user.entity';
import { ServiceCatalog } from '../entities/service-catalog.entity';
import { AssignServiceUserDto } from '../dto/user/assign-service-user.dto';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserService)
    private userServiceRepository: Repository<UserService>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ServiceCatalog)
    private servicioRepository: Repository<ServiceCatalog>,
  ) {}

  async assignServiceToUser (createUserServiceDto: AssignServiceUserDto): Promise<UserService> {
    const { user, service } = createUserServiceDto;
    const userInstance = await this.userRepository.findOneBy({id: user});
    if  (!userInstance) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const serviceInstance = await this.servicioRepository.findOneBy({id: service});
    if  (!serviceInstance) {
      throw new NotFoundException('Servicio no encontrado');
    }
    const userService = this.userServiceRepository.create({user: userInstance, service: serviceInstance});
    return await this.userServiceRepository.save(userService);
  }
  
  async removeServiceFromUser(user: number, service: number) {
    const userInstance = await this.userRepository.findOneBy({id: user});
    if  (!userInstance) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const serviceInstance = await this.servicioRepository.findOneBy({id: service});
    if  (!serviceInstance) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const userService = await this.userServiceRepository.findOneBy({user: userInstance, service: serviceInstance});
    if (!userService) {
      throw new NotFoundException('No se encuentra la relación entre el usuario y el servicio');
    }

    return await this.userServiceRepository.remove(userService);
  }

}