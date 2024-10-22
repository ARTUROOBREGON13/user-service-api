# User Service API

Este proyecto es una API de servicio de usuarios construida con NestJS.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)
- PostgreSQL (o la base de datos que estés utilizando)

## Instalación

1. Clona el repositorio:
git clone https://github.com/tu-usuario/user-service-api.git

2. Navega al directorio del proyecto:
cd user-service-api

3. Instala las dependencias:
npm install

4. Copia el archivo `.env.example` a `.env` y configura las variables de entorno según tu entorno local:
cp .env.example .env


## Ejecución del proyecto

Para ejecutar el proyecto en modo de desarrollo:
npm run start:dev

El servidor estará disponible en `http://localhost:3000`.

## Migraciones

Para ejecutar las migraciones y crear/actualizar la estructura de la base de datos:
npm run migration:run

Si necesitas crear una nueva migración:
npm run migration:create -- -n NombreDeLaMigracion

## Seeders

Para poblar la base de datos con datos iniciales, ejecuta los seeders:
npm run seed

Esto ejecutará todos los seeders definidos en el proyecto.

## Pruebas

Para ejecutar las pruebas unitarias:
npm run test

Para las pruebas e2e:
npm run test:e2e

## Documentación API

La documentación de la API está disponible a través de Swagger UI. Una vez que el servidor esté en ejecución, puedes acceder a ella en:
http://localhost:3000/api

## Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio de GitHub.
