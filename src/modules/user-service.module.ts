import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../entities/user-service.entity';
import { UserServiceService } from '../services/user-service.service';
import { UserServiceController } from '../controllers/user-service.controller';
import { User } from '../entities/user.entity';
import { ServiceCatalog } from '../entities/service-catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserService, User, ServiceCatalog])],
  providers: [UserServiceService],
  controllers: [UserServiceController],
})
export class UserServiceModule {}
