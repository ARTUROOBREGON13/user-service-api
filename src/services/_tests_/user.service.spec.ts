import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserService as UserServiceEntity } from '../../entities/user-service.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        rol: 'user',
      };

      const salt = 'test-salt';
      const hashedPassword = 'hashed-password';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const savedUser = new User();
      Object.assign(savedUser, {
        ...createUserDto,
        password: hashedPassword,
      });

      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, salt);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: createUserDto.nombre,
          email: createUserDto.email,
          password: hashedPassword,
          rol: createUserDto.rol,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new User(), new User()];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new User();
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = new User();
      mockRepository.findOneBy.mockResolvedValue(user);

      const email = 'test@ exmaple.com';
      const result = await service.findOneByEmail(email);

      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserServices', () => {
    it('should return user services', async () => {
      const user = new User();
      const userService = new UserServiceEntity();
      user.userServices = [userService];
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await service.getUserServices(1);

      expect(result).toEqual(user.userServices);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getUserServices(1)).rejects.toThrow(NotFoundException);
    });
  });
});