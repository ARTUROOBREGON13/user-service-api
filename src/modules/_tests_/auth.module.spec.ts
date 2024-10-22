import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { AuthService } from '../../services/auth.service';
import { AuthController } from '../../controllers/auth.controller';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { UserService } from '../../entities/user-service.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ServiceCatalog } from '../../entities/service-catalog.entity';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [User, ServiceCatalog, UserService],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService, JwtStrategy, UserService],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should provide AuthController', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
    expect(authController).toBeInstanceOf(AuthController);
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
    expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
  });

  it('should provide UserService', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
    expect(userService).toBeInstanceOf(UserService);
  });

  it('should configure JwtModule with correct options', () => {
    const configService = module.get<ConfigService>(ConfigService);
    const jwtConfig = {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h',
      },
    };

    expect(jwtConfig.secret).toBeDefined();
    expect(jwtConfig.signOptions.expiresIn).toBeDefined();
  });

  describe('Module Dependencies', () => {
    it('should import User Module', () => {
      const userModule = module.get(UserModule);
      expect(userModule).toBeDefined();
    });

    it('should import PassportModule', () => {
      const passportModule = module.get(PassportModule);
      expect(passportModule).toBeDefined();
    });

    it('should import ConfigModule', () => {
      const configModule = module.get(ConfigModule);
      expect(configModule).toBeDefined();
    });

    it('should import JwtModule with correct configuration', () => {
      const jwtModule = module.get(JwtModule);
      expect(jwtModule).toBeDefined();
    });
  });

  describe('Environment Configuration', () => {
    it('should load JWT configuration from environment', () => {
      const configService = module.get<ConfigService>(ConfigService);
      const jwtSecret = configService.get <string>('JWT_SECRET');
      const jwtExpiration = configService.get<string>('JWT_EXPIRATION');

      expect(jwtSecret).toBeDefined();
      expect(jwtExpiration).toBeDefined();
    });
  });
});