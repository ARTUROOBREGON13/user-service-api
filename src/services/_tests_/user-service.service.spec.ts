import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceService } from '../user-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../entities/user-service.entity';
import { User } from '../../entities/user.entity';
import { ServiceCatalog } from '../../entities/service-catalog.entity';
import { Repository } from 'typeorm';
import { AssignServiceUserDto } from '../../dto/user/assign-service-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserServiceService', () => {
  let userServiceService: UserServiceService;
  let userServiceRepository: Repository<UserService>;
  let userRepository: Repository<User>;
  let servicioRepository: Repository<ServiceCatalog>;

  const mockUserServiceRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockServicioRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        {
          provide: getRepositoryToken(UserService),
          useValue: mockUserServiceRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ServiceCatalog),
          useValue: mockServicioRepository,
        },
      ],
    }).compile();

    userServiceService = module.get<UserServiceService>(UserServiceService);
    userServiceRepository = module.get<Repository<UserService>>(getRepositoryToken(UserService));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    servicioRepository = module.get<Repository<ServiceCatalog>>(getRepositoryToken(ServiceCatalog));
  });

  it('should be defined', () => {
    expect(userServiceService).toBeDefined();
  });

  describe('assignServiceToUser', () => {
    it('should assign a service to a user', async () => {
      const assignServiceUserDto: AssignServiceUserDto = {
        user: 1,
        service: 1,
      };

      const userInstance = new User();
      const serviceInstance = new ServiceCatalog();
      const userServiceInstance = new UserService();

      mockUserRepository.findOneBy.mockResolvedValue(userInstance);
      mockServicioRepository.findOneBy.mockResolvedValue(serviceInstance);
      mockUserServiceRepository.create.mockReturnValue(userServiceInstance);
      mockUserServiceRepository.save.mockResolvedValue(userServiceInstance);

      const result = await userServiceService.assignServiceToUser(assignServiceUserDto);

      expect(result).toEqual(userServiceInstance);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: assignServiceUserDto.user });
      expect(mockServicioRepository.findOneBy).toHaveBeenCalledWith({ id: assignServiceUserDto.service });
      expect(mockUserServiceRepository.create).toHaveBeenCalledWith({
        user: userInstance,
        service: serviceInstance,
      });
      expect(mockUserServiceRepository.save).toHaveBeenCalledWith(userServiceInstance);
    });

    it('should throw NotFoundException when user not found', async () => {
      const assignServiceUserDto: AssignServiceUserDto = {
        user: 1,
        service: 1,
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(userServiceService.assignServiceToUser(assignServiceUserDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service not found', async () => {
      const assignServiceUserDto: AssignServiceUserDto = {
        user: 1,
        service:  1,
      };

      const userInstance = new User();
      mockUserRepository.findOneBy.mockResolvedValue(userInstance);
      mockServicioRepository.findOneBy.mockResolvedValue(null);

      await expect(userServiceService.assignServiceToUser(assignServiceUserDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('removeServiceFromUser', () => {
    it('should remove a service from a user', async () => {
      const user = 1;
      const service = 1;

      const userInstance = new User();
      const serviceInstance = new ServiceCatalog();
      const userServiceInstance = new UserService();

      mockUserRepository.findOneBy.mockResolvedValue(userInstance);
      mockServicioRepository.findOneBy.mockResolvedValue(serviceInstance);
      mockUserServiceRepository.findOneBy.mockResolvedValue(userServiceInstance);
      mockUserServiceRepository.remove.mockResolvedValue(userServiceInstance);

      const result = await userServiceService.removeServiceFromUser(user, service);

      expect(result).toEqual(userServiceInstance);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: user });
      expect(mockServicioRepository.findOneBy).toHaveBeenCalledWith({ id: service });
      expect(mockUserServiceRepository.findOneBy).toHaveBeenCalledWith({
        user: userInstance,
        service: serviceInstance,
      });
      expect(mockUserServiceRepository.remove).toHaveBeenCalledWith(userServiceInstance);
    });

    it('should throw NotFoundException when user not found', async () => {
      const user = 1;
      const service = 1;

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(userServiceService.removeServiceFromUser(user, service))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service not found', async () => {
      const user = 1;
      const service = 1;

      const userInstance = new User();
      mockUserRepository.findOneBy.mockResolvedValue(userInstance);
      mockServicioRepository.findOneBy.mockResolvedValue(null);

      await expect(userServiceService.removeServiceFromUser(user, service))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when no relation between user and service found', async () => {
      const user = 1;
      const service = 1;

      const userInstance = new User();
      const serviceInstance = new ServiceCatalog();
      mockUserRepository.findOneBy.mockResolvedValue(userInstance);
      mockServicioRepository.findOneBy.mockResolvedValue(serviceInstance);
      mockUserServiceRepository.findOneBy.mockResolvedValue(null);

      await expect(userServiceService.removeServiceFromUser(user, service))
        .rejects.toThrow(NotFoundException);
    });
  });
});