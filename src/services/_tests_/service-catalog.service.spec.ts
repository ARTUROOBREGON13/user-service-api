import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCatalogService } from '../service-catalog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceCatalog } from '../../entities/service-catalog.entity';
import { In, Repository } from 'typeorm';
import { CreateServiceDto } from '../../dto/service/create-service.dto';
import { UpdateServiceDto } from '../../dto/service/update-service.dto';
import { NotFoundException } from '@nestjs/common';

describe('ServiceCatalogService', () => {
  let service: ServiceCatalogService;
  let repository: Repository<ServiceCatalog>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCatalogService,
        {
          provide: getRepositoryToken(ServiceCatalog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceCatalogService>(ServiceCatalogService);
    repository = module.get<Repository<ServiceCatalog>>(getRepositoryToken(ServiceCatalog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = {
        nombre: 'Test Service',
        descripcion: 'Test Description',
        costo: 100,
        categoria: 'Test Category',
      };

      const newService = new ServiceCatalog();
      Object.assign(newService, createServiceDto);

      mockRepository.create.mockReturnValue(newService);
      mockRepository.save.mockResolvedValue(newService);

      const result = await service.create(createServiceDto);

      expect(result).toEqual(newService);
      expect(mockRepository.create).toHaveBeenCalledWith(createServiceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newService);
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const services = [new ServiceCatalog(), new ServiceCatalog()];
      mockRepository.findBy.mockResolvedValue(services);

      const result = await service.findAll();

      expect(result).toEqual(services);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ deletedAt: null });
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id', async () => {
      const testService = new ServiceCatalog();
      mockRepository.findOneBy.mockResolvedValue(testService);

      const result = await service.getServiceById(1);

      expect(result).toEqual(testService);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when service not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getServiceById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getServicesById', () => {
    it('should return services by ids', async () => {
      const services = [new ServiceCatalog(), new ServiceCatalog()];
      mockRepository.findBy.mockResolvedValue(services);

      const ids = [1, 2];
      const result = await service.getServicesById(ids);

      expect(result).toEqual(services);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ id: In(ids) });
    });
  });

  describe('updateService ', () => {
    it('should update a service', async () => {
      const testService = new ServiceCatalog();
      mockRepository.findOneBy.mockResolvedValue(testService);

      const updateServiceDto: UpdateServiceDto = {
        nombre: 'Updated Test Service',
        descripcion: 'Updated Test Description',
        costo: 200,
        categoria: 'Updated Test Category',
      };

      const updatedService = new ServiceCatalog();
      Object.assign(updatedService, updateServiceDto);

      mockRepository.merge.mockReturnValue(updatedService);
      mockRepository.save.mockResolvedValue(updatedService);

      const result = await service.updateService(1, updateServiceDto);

      expect(result).toEqual(updatedService);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.merge).toHaveBeenCalledWith(testService, updateServiceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedService);
    });

    it('should throw NotFoundException when service not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateService(1, {} as UpdateServiceDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const testService = new ServiceCatalog();
      mockRepository.findOneBy.mockResolvedValue(testService);

      mockRepository.remove.mockResolvedValue(testService);

      const result = await service.deleteService(1);

      expect(result).toEqual(testService);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(testService);
    });

    it('should throw NotFoundException when service not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteService(1)).rejects.toThrow(NotFoundException);
    });
  });
});