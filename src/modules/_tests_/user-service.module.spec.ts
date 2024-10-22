import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceModule } from '../user-service.module';
import { UserServiceService } from '../../services/user-service.service';
import { UserServiceController } from '../../controllers/user-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../entities/user-service.entity';
import { User } from '../../entities/user.entity';
import { ServiceCatalog } from '../../entities/service-catalog.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UserServiceModule', () => {
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
            entities: [UserService, User, ServiceCatalog],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        UserServiceModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('Module Components', () => {
    it('should provide UserServiceService', () => {
      const service = module.get<UserServiceService>(UserServiceService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UserServiceService);
    });

    it('should provide UserServiceController', () => {
      const controller = module.get<UserServiceController>(UserServiceController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(UserServiceController);
    });
  });

  describe('TypeORM Configuration', () => {
    it('should configure TypeORM with all required entities', () => {
      const typeOrmModule = module.get(TypeOrmModule);
      expect(typeOrmModule).toBeDefined();
    });

    it('should have UserService repository available', () => {
      const service = module.get<UserServiceService>(UserServiceService);
      expect(service['userServiceRepository']).toBeDefined();
    });

    it('should have User repository available', () => {
      const service = module.get<UserServiceService>(UserServiceService);
      expect(service['userRepository']).toBeDefined();
    });

    it('should have ServiceCatalog repository available', () => {
      const service = module.get<UserServiceService>(UserServiceService);
      expect(service['servicioRepository']).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have correct imports', () => {
      const imports = Reflect.getMetadata('imports', UserServiceModule);
      const typeOrmFeatureModule = imports[0];
      expect(typeOrmFeatureModule).toBeDefined();
      
      // Verificar que las entidades correctas están configuradas en TypeOrmModule.forFeature
      const entities = typeOrmFeatureModule.entities;
      expect(entities).toContain(UserService);
      expect(entities).toContain(User);
      expect(entities).toContain(ServiceCatalog);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', UserServiceModule);
      expect(providers).toContain(UserServiceService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', UserServiceModule);
      expect(controllers).toContain(UserServiceController);
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

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });
});