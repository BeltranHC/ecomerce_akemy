"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            process.env.FRONTEND_URL || 'http://localhost:3000',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-session-id'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 AKEMY API corriendo en: http://localhost:${port}`);
    console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map