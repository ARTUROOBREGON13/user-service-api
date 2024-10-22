import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/services/user.service';
import { ServiceCatalogService } from '../src/services/service-catalog.service';
import { CreateUserDto } from '../src/dto/user/create-user.dto';
import { CreateServiceDto } from '../src/dto/service/create-service.dto';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const serviceCatalogService = app.get(ServiceCatalogService);

  // Crear usuarios
  const users: CreateUserDto[] = [
    { nombre: 'Admin User', email: 'admin@example.com', password: 'AdminPass123!', rol: 'admin' },
    { nombre: 'Regular User 1', email: 'user1@example.com', password: 'UserPass123!', rol: 'user' },
    { nombre: 'Regular User 2', email: 'user2@example.com', password: 'UserPass456!', rol: 'user' },
  ];

  for (const user of users) {
    await userService.create(user);
  }

  // Crear servicios
  const services: CreateServiceDto[] = [
    { nombre: 'Reparación de Computadoras', descripcion: 'Servicio de reparación de PCs y laptops', costo: 50, categoria: 'Tecnología' },
    { nombre: 'Consulta Médica General', descripcion: 'Consulta médica de rutina', costo: 100, categoria: 'Salud' },
    { nombre: 'Limpieza del Hogar', descripcion: 'Servicio de limpieza profunda para casas', costo: 80, categoria: 'Hogar' },
    { nombre: 'Desarrollo de Aplicaciones Móviles', descripcion: 'Creación de apps para iOS y Android', costo: 5000, categoria: 'Tecnología' },
    { nombre: 'Terapia Física', descripcion: 'Sesiones de fisioterapia', costo: 70, categoria: 'Salud' },
  ];

  for (const service of services) {
    await serviceCatalogService.create(service);
    console.log(`Servicio creado: ${service.nombre}`);
  }

  await app.close();
  console.log('Seeding completado');
}

seed();