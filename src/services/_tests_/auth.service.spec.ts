import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', nombre: 'Test User' };
      (userService.findOneByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@example.com', nombre: 'Test User' });
    });

    it('should return null when user is not found', async () => {
      (userService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      (userService.findOneByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const user = { id: 1, email: 'test@example.com', nombre: 'Test User', rol: 'user' };
      (jwtService.sign as jest.Mock).mockReturnValue('mockedToken');

      const result = await service.login(user);
      expect(result).toEqual({
        access_token: 'mockedToken',
        userName: 'Test User',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@example.com', sub: 1, name: 'Test User', role: 'user' });
    });
  });
});