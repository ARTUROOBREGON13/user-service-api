import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from '../user-service.controller';
import { UserServiceService } from '../../services/user-service.service';
import { AssignServiceUserDto } from '../../dto/user/assign-service-user.dto';
import { UserService } from '../../entities/user-service.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserServiceController', () => {
  let controller: UserServiceController;
  let userServiceService: UserServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [
        {
          provide: UserServiceService,
          useValue: {
            assignServiceToUser: jest.fn(),
            removeServiceFromUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
    userServiceService = module.get<UserServiceService>(UserServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('assignServiceToUser', () => {
    it('should assign a service to a user and return the result', async () => {
      const userId = 1;
      const serviceId = 2;
      const assignServiceUserDto: AssignServiceUserDto = { user: userId, service: serviceId };
      const userService = new UserService();

      jest.spyOn(userServiceService, 'assignServiceToUser').mockResolvedValue(userService);

      const result = await controller.assignServiceToUser (userId, serviceId);
      expect(result).toEqual(userService);
      expect(userServiceService.assignServiceToUser ).toHaveBeenCalledWith(assignServiceUserDto);
    });

    it('should throw BadRequestException for invalid input', async () => {
      const userId = null; // Simulando un ID de usuario inválido
      const serviceId = null; // Simulando un ID de servicio inválido

      await expect(controller.assignServiceToUser (userId, serviceId)).resolves.toBeUndefined();
    });
  });

  describe('removeServiceFromUser', () => {
    it('should remove a service from a user and return a success message', async () => {
      const userId = 1;
      const serviceId = 2;

      jest.spyOn(userServiceService, 'removeServiceFromUser').mockResolvedValue(undefined);

      const result = await controller.removeServiceFromUser (userId, serviceId);
      expect(result).toBeUndefined();
      expect(userServiceService.removeServiceFromUser ).toHaveBeenCalledWith(userId, serviceId);
    });

    it('should throw NotFoundException if user or service not found', async () => {
      const userId = 1;
      const serviceId = 2;

      jest.spyOn(userServiceService, 'removeServiceFromUser').mockRejectedValue(new NotFoundException());

      await expect(controller.removeServiceFromUser (userId, serviceId)).rejects.toThrow(NotFoundException);
    });
  });
});