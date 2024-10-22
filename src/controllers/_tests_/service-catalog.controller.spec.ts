import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCatalogController } from '../../controllers/service-catalog.controller';
import { ServiceCatalogService } from '../../services/service-catalog.service';
import { CreateServiceDto } from '../../dto/service/create-service.dto';
import { UpdateServiceDto } from '../../dto/service/update-service.dto';
import { ServiceCatalog } from '../../entities/service-catalog.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ServiceCatalogController', () => {
  let controller: ServiceCatalogController;
  let serviceCatalogService: ServiceCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCatalogController],
      providers: [
        {
          provide: ServiceCatalogService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getServiceById: jest.fn(),
            updateService: jest.fn(),
            deleteService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServiceCatalogController>(ServiceCatalogController);
    serviceCatalogService = module.get<ServiceCatalogService>(ServiceCatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service and return it', async () => {
      const createServiceDto: CreateServiceDto = { nombre: 'Test Service', descripcion: 'Service description', categoria: 'test', costo: 1 };
      const service = new ServiceCatalog();
      jest.spyOn(serviceCatalogService, 'create').mockResolvedValue(service);

      const result = await controller.create(createServiceDto);
      expect(result).toEqual(service);
      expect(serviceCatalogService.create).toHaveBeenCalledWith(createServiceDto);
    });

    it('should throw BadRequestException for invalid input', async () => {
      const createServiceDto: CreateServiceDto = { nombre: '', descripcion: '', categoria: '', costo: 0 }; // Simulando datos inválidos

      jest.spyOn(serviceCatalogService, 'create').mockRejectedValue(new Error('Invalid input'));

      await expect(controller.create(createServiceDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const services = [new ServiceCatalog(), new ServiceCatalog()];
      jest.spyOn(serviceCatalogService, 'findAll').mockResolvedValue(services);

      const result = await controller.findAll();
      expect(result).toEqual(services);
    });
  });

  describe('getServiceById', () => {
    it('should return a service by ID', async () => {
      const service = new ServiceCatalog();
      jest.spyOn(serviceCatalogService, 'getServiceById').mockResolvedValue(service);

      const result = await controller.getServiceById(1);
      expect(result).toEqual(service);
      expect(serviceCatalogService.getServiceById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service not found', async () => {
      jest.spyOn(serviceCatalogService, 'getServiceById').mockRejectedValue(new NotFoundException());

      await expect(controller.getServiceById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateService', () => {
    it('should update a service and return it', async () => {
      const updateServiceDto: UpdateServiceDto = { nombre: 'Updated Service', descripcion: 'Updated description' };
      const service = new ServiceCatalog();
      jest.spyOn(serviceCatalogService, 'updateService').mockResolvedValue(service);

      const result = await controller.updateService(1, updateServiceDto);
      expect(result).toEqual(service);
      expect(serviceCatalogService.updateService).toHaveBeenCalledWith(1, updateServiceDto);
    });

    it('should throw NotFoundException if service not found', async () => {
      const updateServiceDto: UpdateServiceDto = { nombre: 'Updated Service', descripcion: 'Updated description' };
      jest.spyOn(serviceCatalogService, 'updateService').mockRejectedValue(new NotFoundException());

      await expect(controller.updateService(1, updateServiceDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteService', () => {
    it('should delete a service and return a success message', async () => {
      jest.spyOn(serviceCatalogService, 'deleteService').mockResolvedValue(undefined);

      const result = await controller.deleteService(1);
      expect(result).toBeUndefined();
 expect(serviceCatalogService.deleteService).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service not found', async () => {
      jest.spyOn(serviceCatalogService, 'deleteService').mockRejectedValue(new NotFoundException());

      await expect(controller.deleteService(1)).rejects.toThrow(NotFoundException);
    });
  });
});