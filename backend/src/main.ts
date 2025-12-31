import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Crear directorio de uploads antes de iniciar la app
const uploadsPath = join(process.cwd(), 'uploads');
if (!existsSync(uploadsPath)) {
  mkdirSync(uploadsPath, { recursive: true });
  console.log('📁 Directorio uploads creado');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad - configurar Helmet con headers de seguridad adicionales
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
    },
  }));
  app.use(cookieParser());

  // CORS - Configuración flexible para desarrollo y producción
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3003',
        'https://ecommerce-akemy.vercel.app',
        'https://akemy.app',
        'https://www.akemy.app',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Permitir requests sin origin (como mobile apps o Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Permitir dominio propio akemy.app
      if (origin.includes('akemy.app')) {
        return callback(null, true);
      }

      // Permitir cualquier subdominio de Vercel que contenga el nombre del proyecto
      if (origin.includes('vercel.app') && (origin.includes('ecommerce-akemy') || origin.includes('ecomerce-akemy') || origin.includes('akemy'))) {
        return callback(null, true);
      }

      // Permitir orígenes específicos configurados
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Para desarrollo, permitir localhost
      if (origin.includes('localhost')) {
        return callback(null, true);
      }

      callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-session-id'],
  });

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Validación y sanitización global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('AKEMY API')
    .setDescription('API para el sistema E-commerce AKEMY - Papelería y Librería')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('products', 'Gestión de productos')
    .addTag('categories', 'Gestión de categorías')
    .addTag('orders', 'Gestión de pedidos')
    .addTag('cart', 'Carrito de compras')
    .addTag('admin', 'Panel de administración')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 AKEMY API corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
