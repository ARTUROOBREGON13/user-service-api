import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '../../entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'password' };
      const user = { id: 1, username: 'test' };
      const token = 'token';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue({access_token: token, userName:user.username});

      const result = await controller.login({ body: loginDto });
      expect(result.access_token).toBe(token);
      expect(authService.validateUser ).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'wrongpassword' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(controller.login({ body: loginDto })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unexpected errors', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'password' };

      jest.spyOn(authService, 'validateUser').mockRejectedValue(new Error('Some error'));

      await expect(controller.login({ body: loginDto })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a user and return a success message', async () => {
      const createUserDto: CreateUserDto = { nombre: 'test', password: 'password', email: 'test@example.com', rol:"user" };
      const user = new User();
      user.id = 1;
      user.nombre = createUserDto.nombre;
      user.email = createUserDto.email;
      user.rol = createUserDto.rol;

      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const result = await controller.register(createUserDto);
      expect(result).toEqual({ message: 'Usuario creado con éxito', userId: user.id });
    });

    it('should throw BadRequestException on user creation error', async () => {
      const createUserDto: CreateUserDto = { nombre: 'test', password: 'password', email: 'test@example.com', rol:"user" };

      jest.spyOn(userService, 'create').mockRejectedValue(new Error('Some error'));

      await expect(controller.register(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { id: 1, username: 'test' } };
      const result = await controller.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});