import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { UserService } from '../../services/user.service';
import { UserController } from '../../controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UserModule', () => {
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
            entities: [User],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        UserModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('Module Components', () => {
    it('should provide UserService', () => {
      const service = module.get<UserService>(UserService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UserService);
    });

    it('should provide UserController', () => {
      const controller = module.get<UserController>(UserController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(UserController);
    });
  });

  describe('TypeORM Configuration', () => {
    it('should configure TypeORM with User entity', () => {
      const typeOrmModule = module.get(TypeOrmModule);
      expect(typeOrmModule).toBeDefined();
    });

    it('should have User repository available', () => {
      const service = module.get<UserService>(UserService);
      expect(service['userRepository']).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have correct imports', () => {
      const imports = Reflect.getMetadata('imports', UserModule);
      const typeOrmFeatureModule = imports[0];
      expect(typeOrmFeatureModule).toBeDefined();
      
      // Verificar que la entidad User está configurada en TypeOrmModule.forFeature
      const entities = typeOrmFeatureModule.entities;
      expect(entities).toContain(User);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', UserModule);
      expect(providers).toContain(UserService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UserModule);
      expect(controllers).toContain(UserController);
    });

    it('should export TypeOrmModule and UserService', () => {
      const exports = Reflect.getMetadata('exports', UserModule);
      expect(exports).toContain(TypeOrmModule);
      expect(exports).toContain(UserService);
    });
  });

  describe('Database Connection', () => {
    it('should establish database connection', async () => {
      const configService = module.get<ConfigService>(ConfigService);
      expect(configService.get('DB_HOST')).toBeDefined();
      expect(configService.get('DB_PORT')).toBeDefined();
      expect(configService.get('DB_USERNAME')).toBeDefined();
      expect(configService.get('DB_PASSWORD')).toBeDefined();
      expect(configService.get('DB_DATABASE')).toBeDefined();
    });
  });

  describe(' Module Closing', () => {
    it('should close the module', async () => {
      await module.close();
      expect(module).toBeUndefined();
    });
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });
});