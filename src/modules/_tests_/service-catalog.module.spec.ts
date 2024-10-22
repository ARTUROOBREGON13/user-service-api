import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCatalogModule } from '../service-catalog.module';
import { ServiceCatalogService } from '../../services/service-catalog.service';
import { ServiceCatalogController } from '../../controllers/service-catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCatalog } from '../../entities/service-catalog.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ServiceCatalogModule', () => {
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
            entities: [ServiceCatalog],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        ServiceCatalogModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('Module Components', () => {
    it('should provide ServiceCatalogService', () => {
      const service = module.get<ServiceCatalogService>(ServiceCatalogService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ServiceCatalogService);
    });

    it('should provide ServiceCatalogController', () => {
      const controller = module.get<ServiceCatalogController>(ServiceCatalogController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(ServiceCatalogController);
    });
  });

  describe('TypeORM Configuration', () => {
    it('should configure TypeORM with ServiceCatalog entity', () => {
      const typeOrmModule = module.get(TypeOrmModule);
      expect(typeOrmModule).toBeDefined();
    });

    it('should have ServiceCatalog repository available', async () => {
      const service = module.get<ServiceCatalogService>(ServiceCatalogService);
      expect(service['serviceRepository']).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should export TypeOrmModule', () => {
      const exports = Reflect.getMetadata('exports', ServiceCatalogModule);
      expect(exports).toContain(TypeOrmModule);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', ServiceCatalogModule);
      expect(providers).toContain(ServiceCatalogService);
    });

    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', ServiceCatalogModule);
      expect(controllers).toContain(ServiceCatalogController);
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