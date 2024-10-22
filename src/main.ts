import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const api_prefix = configService.get('API_PREFIX');
  app.use(helmet());
  app.use(cors());

  // Configuración de Swagger (ya existente)
  const config = new DocumentBuilder()
    .setTitle('User-Service API')
    .setDescription('API para gestionar usuarios y servicios')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('services')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(api_prefix, app, document);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();