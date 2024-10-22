import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { UserService as UserServiceInstance } from '../../entities/user-service.entity';
import { User } from '../../entities/user.entity';
import { UserServiceResponseDto } from '../../dto/user/user-service-response.dto';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import { NotFoundException } from '@nestjs/common';
import { ServiceCatalog } from '../../entities/service-catalog.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            getUserServices: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [new User(), new User()];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('getUserServices', () => {
    it('should return services assigned to a user', async () => {
      const userId = 1;
      const mockServices = [
        { nombre: 'Service 1', categoria:'test', costo: 1, descripcion:'Service 1' },
        { nombre: 'Service 2', categoria:'test', costo: 1, descripcion:'Service 2' },
      ];
      const expectedResult:UserServiceResponseDto[] = [
        { nombre: 'Service 1', categoria:'test', costo: 1, descripcion:'Service 1' },
        { nombre: 'Service 2', categoria:'test', costo: 1, descripcion:'Service 2' },
      ];

      jest.spyOn(userService, 'getUserServices').mockResolvedValue(mockServices.map((value)=>{
        const it = new UserServiceInstance();
        it.service = new ServiceCatalog();
        it.service.nombre = value.nombre;
        it.service.categoria = value.categoria;
        it.service.costo = value.costo;
        it.service.descripcion = value.descripcion;
        return it;
      }));

      expect(await controller.getUserServices(userId)).toEqual(expectedResult);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;

      jest.spyOn(userService, 'getUserServices').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.getUserServices(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserDetails', () => {
    it('should return user details', async () => {
      const userId = 1;
      const mockUser = new User();
      mockUser.id = userId;
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      expect((await controller.getUserDetails(userId)).id).toBe(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = -1;

      jest.spyOn(userService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.getUserDetails(userId)).rejects.toThrow(NotFoundException);
    });
  });
});