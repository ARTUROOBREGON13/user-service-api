import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with correct config', () => {
      const secretKey = 'test-secret';
      mockConfigService.get.mockReturnValue(secretKey);

      const newStrategy = new JwtStrategy(configService);

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(newStrategy.getSecretKey()).toBe(secretKey);
    });
  });

  describe('validate', () => {
    it('should validate and return user payload', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com',
        role: 'user',
        name: 'Test User'
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        fullName: payload.name
      });
    });

    it('should handle payload without optional fields', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com'
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: undefined,
        fullName: undefined
      });
    });

    it('should validate with different role types', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com',
        role: 'admin',
        name: 'Admin User'
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        fullName: payload.name
      });
    });
  });

  describe('getSecretKey', () => {
    it('should return the configured secret key', () => {
      const secretKey = 'test-secret';
      mockConfigService.get.mockReturnValue(secretKey);

      const strategy = new JwtStrategy(configService);
      
      expect(strategy.getSecretKey()).toBe(secretKey);
    });

    it('should match the secret key used in the strategy', () => {
      const secretKey = 'test-secret';
      mockConfigService.get.mockReturnValue(secretKey);

      const strategy = new JwtStrategy(configService);
      
      expect(strategy.getSecretKey()).toBe(configService.get('JWT_SECRET'));
    });
  });

  describe('error handling', () => {
    it('should handle missing JWT_SECRET configuration', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => new JwtStrategy(configService)).not.toThrow();
    });

    it('should handle invalid payload structure', async () => {
      const invalidPayload = {};

      const result = await strategy.validate(invalidPayload);

      expect(result).toEqual({
        id: undefined,
        email: undefined,
         role: undefined,
        fullName: undefined
      });
    });

    it('should handle unauthorized access', async () => {
      const unauthorizedPayload = {
        sub: 1,
        email: 'test@example.com',
        role: 'invalid'
      };

      await expect(strategy.validate(unauthorizedPayload)).rejects.toThrow(UnauthorizedException);
    });
  });
});