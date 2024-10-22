import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ServiceCatalog } from '../entities/service-catalog.entity';
import { CreateServiceDto } from '../dto/service/create-service.dto';
import { UpdateServiceDto } from '../dto/service/update-service.dto';

@Injectable()
export class ServiceCatalogService {
  constructor(
    @InjectRepository(ServiceCatalog)
    private serviceRepository: Repository<ServiceCatalog>,
  ) {}

  async create(createServicioDto: CreateServiceDto): Promise<ServiceCatalog> {
    const servicio = this.serviceRepository.create(createServicioDto);
    return await this.serviceRepository.save(servicio);
  }

  async findAll(): Promise<ServiceCatalog[]> {
    return await this.serviceRepository.findBy({ deletedAt: null });
  }

  async getServiceById(id: number) {
    const it = await this.serviceRepository.findOneBy({ id });
    if (!it) {
      throw new NotFoundException("Servicio no encontrado");
    }
    return it;
  }

  async getServicesById(ids: number[]) {
    return await this.serviceRepository.findBy({ id: In(ids) });
  }

  async updateService(id: number, updateServiceDto: UpdateServiceDto) {
    const it = await this.serviceRepository.findOneBy({ id });
    if (!it) {
      throw new NotFoundException("Servicio no encontrado");
    }
    const updated = this.serviceRepository.merge(it, updateServiceDto);

    return this.serviceRepository.save(updated);
  }

  async deleteService(id: number) {
    const it = await this.serviceRepository.findOneBy({ id });
    if (!it) {
      throw new NotFoundException("Servicio no encontrado");
    }

    return this.serviceRepository.remove(it);
  }
}
