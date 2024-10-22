import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCatalog } from '../entities/service-catalog.entity';
import { ServiceCatalogService } from '../services/service-catalog.service';
import { ServiceCatalogController } from '../controllers/service-catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCatalog])],
  providers: [ServiceCatalogService],
  controllers: [ServiceCatalogController],
  exports: [TypeOrmModule],
})
export class ServiceCatalogModule {}
