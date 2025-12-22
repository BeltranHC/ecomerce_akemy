# DOCUMENTACIÓN TÉCNICA
# Sistema E-commerce AKEMY - Librería y Papelería Online

---

## INFORMACIÓN DEL DOCUMENTO

| Campo | Valor |
|-------|-------|
| **Proyecto** | AKEMY - Sistema E-commerce de Papelería y Librería |
| **Versión** | 1.0 |
| **Fecha** | Diciembre 2025 |
| **Tipo de Aplicación** | Aplicación Web Full Stack |

---

## TABLA DE CONTENIDOS

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Módulos del Sistema](#6-módulos-del-sistema)
7. [API REST - Endpoints](#7-api-rest---endpoints)
8. [Sistema de Autenticación](#8-sistema-de-autenticación)
9. [WebSockets - Chat en Tiempo Real](#9-websockets---chat-en-tiempo-real)
10. [Configuración y Despliegue](#10-configuración-y-despliegue)
11. [Seguridad](#11-seguridad)
12. [Anexos](#12-anexos)

---

## 1. INTRODUCCIÓN

### 1.1 Descripción General

**Librería AKEMY** es un sistema E-commerce completo diseñado para papelerías y librerías. El sistema ofrece una plataforma integral que incluye:

- **Tienda Online**: Interfaz moderna para clientes con catálogo de productos, carrito de compras, gestión de pedidos y sistema de chat en tiempo real.
- **Panel de Administración**: Herramientas completas para la gestión de productos, pedidos, usuarios, promociones y atención al cliente.

### 1.2 Objetivos del Sistema

- Proporcionar una plataforma de comercio electrónico completa para el sector de papelería y librería
- Facilitar la gestión de inventario, pedidos y clientes
- Ofrecer una experiencia de usuario moderna y responsiva
- Implementar comunicación en tiempo real entre clientes y administradores
- Gestionar promociones, cupones y programas de fidelidad

### 1.3 Alcance Funcional

El sistema comprende las siguientes funcionalidades principales:

**Para Clientes:**
- Registro y autenticación de usuarios
- Navegación y búsqueda de productos
- Carrito de compras persistente
- Gestión de pedidos y seguimiento
- Lista de deseos (Wishlist)
- Comparador de productos
- Sistema de reseñas
- Chat en tiempo real con soporte
- Aplicación de cupones de descuento
- Programa de puntos de fidelidad

**Para Administradores:**
- Dashboard con estadísticas
- Gestión completa de productos (CRUD)
- Gestión de categorías jerárquicas
- Gestión de marcas
- Gestión de pedidos
- Moderación de reseñas
- Gestión de cupones y ofertas
- Panel de chat para atención al cliente
- Gestión de devoluciones

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Frontend (Next.js 15)                     │   │
│  │  • React 18 • TailwindCSS • Zustand • TanStack Query        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (REST API)
                              │ WebSocket (Socket.io)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (NestJS 10)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Módulos: Auth, Users, Products, Orders, Cart, Chat, etc.   │   │
│  │  • JWT Authentication • Rate Limiting • CORS • Helmet       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │ Prisma ORM                           │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL 16                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Patrón de Arquitectura

El sistema implementa una **arquitectura de microservicios monolítica modular** con los siguientes patrones:

- **MVC (Model-View-Controller)**: Separación clara entre la lógica de negocio, datos y presentación
- **Repository Pattern**: Abstracción del acceso a datos mediante Prisma ORM
- **Dependency Injection**: Inyección de dependencias nativa de NestJS
- **DTO Pattern**: Objetos de transferencia de datos para validación

### 2.3 Comunicación

| Tipo | Protocolo | Uso |
|------|-----------|-----|
| API REST | HTTP/HTTPS | Operaciones CRUD, consultas |
| WebSocket | Socket.io | Chat en tiempo real, notificaciones |

---

## 3. TECNOLOGÍAS UTILIZADAS

### 3.1 Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| NestJS | 10.3 | Framework Node.js para aplicaciones escalables |
| TypeScript | 5.x | Superset tipado de JavaScript |
| Prisma | 5.8 | ORM moderno para Node.js y TypeScript |
| PostgreSQL | 16 | Sistema de gestión de base de datos relacional |
| JWT | - | JSON Web Tokens para autenticación |
| Socket.io | - | Comunicación bidireccional en tiempo real |
| Bcrypt | - | Hashing de contraseñas |
| Helmet | - | Seguridad de cabeceras HTTP |
| Class-validator | - | Validación de DTOs |

### 3.2 Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Next.js | 15 | Framework React con App Router |
| React | 18 | Biblioteca para interfaces de usuario |
| TypeScript | 5.x | Tipado estático |
| TailwindCSS | 3.4 | Framework CSS utilitario |
| Zustand | 5 | Gestión de estado global |
| TanStack Query | 5 | Data fetching y caching |
| React Hook Form | - | Manejo de formularios |
| Zod | - | Validación de esquemas |
| shadcn/ui | - | Componentes UI accesibles |

### 3.3 Infraestructura

| Tecnología | Descripción |
|------------|-------------|
| Docker | Contenedorización de servicios |
| Docker Compose | Orquestación de contenedores |
| Node.js | 20+ | Runtime de JavaScript |

---

## 4. ESTRUCTURA DEL PROYECTO

### 4.1 Estructura de Directorios

```
akemy/
├── backend/                    # API REST NestJS
│   ├── prisma/                 # Configuración de base de datos
│   │   ├── schema.prisma       # Esquema de la BD
│   │   ├── seed.ts             # Datos iniciales
│   │   └── migrations/         # Migraciones de BD
│   ├── src/
│   │   ├── main.ts             # Punto de entrada
│   │   ├── app.module.ts       # Módulo principal
│   │   ├── auth/               # Autenticación
│   │   ├── users/              # Gestión de usuarios
│   │   ├── products/           # Gestión de productos
│   │   ├── categories/         # Categorías
│   │   ├── brands/             # Marcas
│   │   ├── orders/             # Pedidos
│   │   ├── cart/               # Carrito de compras
│   │   ├── chat/               # Chat en tiempo real
│   │   ├── wishlist/           # Lista de deseos
│   │   ├── offers/             # Ofertas y promociones
│   │   ├── coupons/            # Cupones de descuento
│   │   ├── reviews/            # Reseñas de productos
│   │   ├── returns/            # Devoluciones
│   │   ├── comparison/         # Comparador de productos
│   │   ├── loyalty/            # Puntos de fidelidad
│   │   ├── banners/            # Banners promocionales
│   │   ├── dashboard/          # Dashboard administrativo
│   │   ├── settings/           # Configuración
│   │   ├── upload/             # Subida de archivos
│   │   ├── mail/               # Servicio de correo
│   │   └── prisma/             # Servicio Prisma
│   ├── uploads/                # Archivos subidos
│   └── Dockerfile
├── frontend/                   # Aplicación Next.js
│   ├── public/                 # Archivos estáticos
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   ├── components/         # Componentes React
│   │   └── lib/                # Utilidades y hooks
│   └── Dockerfile
├── docker-compose.yml          # Orquestación Docker
└── README.md
```

### 4.2 Organización de Módulos Backend

Cada módulo del backend sigue la estructura estándar de NestJS:

```
modulo/
├── modulo.module.ts      # Definición del módulo
├── modulo.controller.ts  # Controlador (endpoints)
├── modulo.service.ts     # Lógica de negocio
└── dto/                  # Data Transfer Objects
    ├── create-*.dto.ts
    └── update-*.dto.ts
```

---

## 5. MODELO DE DATOS

### 5.1 Diagrama Entidad-Relación Simplificado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│   Address   │     │   Category  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      │                   │                    │
      ▼                   ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Cart     │     │    Order    │────<│   Product   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      ▼                   │                    ▼
┌─────────────┐           │             ┌─────────────┐
│  CartItem   │           │             │ProductImage │
└─────────────┘           │             └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  OrderItem  │
                    └─────────────┘
```

### 5.2 Entidades Principales

#### 5.2.1 User (Usuario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | String | Correo electrónico (único) |
| password | String | Contraseña hasheada |
| firstName | String | Nombre |
| lastName | String | Apellido |
| phone | String? | Teléfono |
| role | Enum | CUSTOMER, ADMIN, SUPERADMIN, EDITOR, PRODUCT_MANAGER |
| isVerified | Boolean | Correo verificado |
| isActive | Boolean | Usuario activo |
| loyaltyPoints | Int | Puntos de fidelidad |

#### 5.2.2 Product (Producto)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| sku | String | Código SKU (único) |
| barcode | String? | Código de barras |
| name | String | Nombre del producto |
| slug | String | URL amigable |
| description | String? | Descripción completa |
| price | Decimal | Precio de venta |
| comparePrice | Decimal? | Precio anterior |
| stock | Int | Stock disponible |
| categoryId | UUID | Categoría |
| brandId | UUID? | Marca |
| status | Enum | DRAFT, PUBLISHED, ARCHIVED |
| isFeatured | Boolean | Producto destacado |

#### 5.2.3 Order (Pedido)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| orderNumber | String | Número de pedido |
| userId | UUID | Usuario |
| addressId | UUID | Dirección de envío |
| status | Enum | PENDING, PAID, PREPARING, READY, DELIVERED, CANCELLED |
| subtotal | Decimal | Subtotal |
| shippingCost | Decimal | Costo de envío |
| discount | Decimal | Descuento aplicado |
| total | Decimal | Total del pedido |
| paymentStatus | Enum | Estado del pago |

#### 5.2.4 Category (Categoría)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | String | Nombre |
| slug | String | URL amigable |
| description | String? | Descripción |
| image | String? | Imagen |
| parentId | UUID? | Categoría padre (jerarquía) |
| sortOrder | Int | Orden de visualización |
| isActive | Boolean | Activa |

### 5.3 Enumeraciones (Enums)

```
UserRole:
  - CUSTOMER (Cliente)
  - ADMIN (Administrador)
  - SUPERADMIN (Super Administrador)
  - EDITOR (Editor)
  - PRODUCT_MANAGER (Gestor de Productos)

ProductStatus:
  - DRAFT (Borrador)
  - PUBLISHED (Publicado)
  - ARCHIVED (Archivado)

OrderStatus:
  - PENDING (Pendiente)
  - PAID (Pagado)
  - PREPARING (Preparando)
  - READY (Listo)
  - DELIVERED (Entregado)
  - CANCELLED (Cancelado)

PaymentStatus:
  - PENDING (Pendiente)
  - PAID (Pagado)
  - FAILED (Fallido)
  - CANCELLED (Cancelado)

CouponType:
  - PERCENTAGE (Porcentaje)
  - FIXED_AMOUNT (Monto fijo)

OfferType:
  - PERCENTAGE (Descuento porcentual)
  - FIXED_AMOUNT (Descuento monto fijo)
  - SPECIAL_PRICE (Precio especial)

ReviewStatus:
  - PENDING (Pendiente)
  - APPROVED (Aprobada)
  - REJECTED (Rechazada)

ReturnStatus:
  - REQUESTED (Solicitada)
  - APPROVED (Aprobada)
  - REJECTED (Rechazada)
  - PROCESSED (Procesada)
```

---

## 6. MÓDULOS DEL SISTEMA

### 6.1 Módulo de Autenticación (Auth)

**Responsabilidad**: Gestión de autenticación y autorización de usuarios.

**Funcionalidades**:
- Registro de nuevos usuarios
- Inicio de sesión con JWT
- Refresh tokens para renovación automática
- Verificación de correo electrónico
- Recuperación de contraseña
- Logout

**Archivos principales**:
- `auth.module.ts`: Configuración del módulo
- `auth.service.ts`: Lógica de negocio
- `auth.controller.ts`: Endpoints REST
- `jwt.strategy.ts`: Estrategia de validación JWT
- `jwt-auth.guard.ts`: Guard de protección de rutas

### 6.2 Módulo de Productos (Products)

**Responsabilidad**: Gestión completa del catálogo de productos.

**Funcionalidades**:
- CRUD de productos
- Gestión de imágenes
- Variantes de productos
- Control de inventario
- Búsqueda y filtrado avanzado
- Productos destacados

**Características técnicas**:
- Paginación en listados
- Filtros por categoría, marca, precio, stock
- Ordenamiento múltiple
- Movimientos de inventario automáticos

### 6.3 Módulo de Carrito (Cart)

**Responsabilidad**: Gestión del carrito de compras.

**Funcionalidades**:
- Carrito persistente por usuario
- Carrito por sesión para visitantes
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Aplicación de ofertas activas

### 6.4 Módulo de Pedidos (Orders)

**Responsabilidad**: Gestión del ciclo de vida de pedidos.

**Funcionalidades**:
- Creación de pedidos desde carrito
- Flujo de estados del pedido
- Aplicación de cupones
- Cálculo de puntos de fidelidad
- Notificaciones en tiempo real
- Historial de pedidos

### 6.5 Módulo de Chat (Chat)

**Responsabilidad**: Comunicación en tiempo real entre clientes y soporte.

**Funcionalidades**:
- Conexión WebSocket con Socket.io
- Conversaciones persistentes
- Indicadores de lectura
- Contador de mensajes no leídos
- Notificaciones push

**Eventos WebSocket**:
| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| startConversation | Cliente → Servidor | Iniciar conversación |
| sendMessage | Cliente → Servidor | Enviar mensaje |
| newMessage | Servidor → Cliente | Nuevo mensaje recibido |
| unreadCount | Servidor → Cliente | Contador de no leídos |

### 6.6 Módulo de Cupones (Coupons)

**Responsabilidad**: Gestión de cupones de descuento.

**Funcionalidades**:
- CRUD de cupones
- Validación de cupones
- Tipos: porcentaje y monto fijo
- Límites de uso (total y por usuario)
- Fechas de vigencia
- Monto mínimo de compra

### 6.7 Módulo de Ofertas (Offers)

**Responsabilidad**: Gestión de promociones y ofertas especiales.

**Funcionalidades**:
- Crear ofertas por rango de fechas
- Asignar productos a ofertas
- Tipos de descuento configurables
- Ofertas activas automáticas

### 6.8 Módulo de Reseñas (Reviews)

**Responsabilidad**: Sistema de reseñas de productos.

**Funcionalidades**:
- Crear reseñas (usuarios autenticados)
- Moderación de reseñas
- Rating de 1 a 5 estrellas
- Estados: pendiente, aprobada, rechazada

### 6.9 Módulo de Devoluciones (Returns)

**Responsabilidad**: Gestión de solicitudes de devolución.

**Funcionalidades**:
- Solicitar devolución
- Flujo de aprobación
- Registro de motivos
- Cálculo de reembolso

### 6.10 Módulo de Fidelidad (Loyalty)

**Responsabilidad**: Programa de puntos de fidelidad.

**Funcionalidades**:
- Acumulación de puntos por compras
- Consulta de saldo
- Historial de transacciones
- Tipos: ganancia, canje, ajuste

---

## 7. API REST - ENDPOINTS

### 7.1 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |
| POST | /auth/refresh | Renovar token | No |
| POST | /auth/logout | Cerrar sesión | Sí |
| POST | /auth/verify-email | Verificar correo | No |
| POST | /auth/forgot-password | Solicitar reset | No |
| POST | /auth/reset-password | Cambiar contraseña | No |
| GET | /auth/me | Perfil del usuario | Sí |

### 7.2 Productos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /products | Listar productos | No |
| GET | /products/:id | Detalle de producto | No |
| GET | /products/slug/:slug | Producto por slug | No |
| POST | /products | Crear producto | Admin |
| PATCH | /products/:id | Actualizar producto | Admin |
| DELETE | /products/:id | Eliminar producto | Admin |
| POST | /products/:id/images | Agregar imagen | Admin |
| DELETE | /products/:id/images/:imageId | Eliminar imagen | Admin |

### 7.3 Categorías

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /categories | Listar categorías | No |
| GET | /categories/:id | Detalle | No |
| POST | /categories | Crear | Admin |
| PATCH | /categories/:id | Actualizar | Admin |
| DELETE | /categories/:id | Eliminar | Admin |

### 7.4 Carrito

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /cart | Obtener carrito | Sí |
| POST | /cart/add | Agregar producto | Sí |
| PATCH | /cart/items/:itemId | Actualizar cantidad | Sí |
| DELETE | /cart/items/:itemId | Eliminar item | Sí |
| DELETE | /cart/clear | Vaciar carrito | Sí |

### 7.5 Pedidos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /orders | Mis pedidos | Sí |
| GET | /orders/:id | Detalle de pedido | Sí |
| POST | /orders | Crear pedido | Sí |
| PATCH | /orders/:id/status | Actualizar estado | Admin |
| POST | /orders/:id/cancel | Cancelar pedido | Sí |

### 7.6 Cupones

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /coupons | Listar cupones | Admin |
| POST | /coupons | Crear cupón | Admin |
| PATCH | /coupons/:id | Actualizar | Admin |
| DELETE | /coupons/:id | Eliminar | Admin |
| POST | /coupons/validate | Validar cupón | Sí |

### 7.7 Reseñas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /reviews/product/:productId | Reseñas de producto | No |
| POST | /reviews | Crear reseña | Sí |
| GET | /reviews/pending | Pendientes de moderar | Admin |
| PATCH | /reviews/:id/status | Moderar reseña | Admin |

### 7.8 Chat

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /chat/conversations | Mis conversaciones | Sí |
| POST | /chat/conversations | Nueva conversación | Sí |
| GET | /chat/conversations/:id/messages | Mensajes | Sí |

---

## 8. SISTEMA DE AUTENTICACIÓN

### 8.1 Flujo de Autenticación

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Cliente │     │ Backend │     │   BD    │
└────┬────┘     └────┬────┘     └────┬────┘
     │               │               │
     │  1. Login     │               │
     │──────────────>│               │
     │               │  2. Verificar │
     │               │──────────────>│
     │               │<──────────────│
     │               │               │
     │  3. JWT +     │               │
     │     Refresh   │               │
     │<──────────────│               │
     │               │               │
     │  4. Request   │               │
     │  + Bearer     │               │
     │──────────────>│               │
     │               │  5. Validar   │
     │               │     JWT       │
     │  6. Response  │               │
     │<──────────────│               │
```

### 8.2 Estructura del JWT

**Access Token (15 minutos)**:
```json
{
  "sub": "user-uuid",
  "email": "usuario@email.com",
  "role": "CUSTOMER",
  "firstName": "Nombre",
  "iat": 1702656000,
  "exp": 1702656900
}
```

**Refresh Token (7 días)**:
```json
{
  "sub": "user-uuid",
  "iat": 1702656000,
  "exp": 1703260800
}
```

### 8.3 Guards y Decoradores

**JwtAuthGuard**: Protege rutas que requieren autenticación.

**RolesGuard**: Verifica roles de usuario para acceso.

**Decoradores personalizados**:
- `@Public()`: Marca ruta como pública
- `@Roles('ADMIN', 'SUPERADMIN')`: Define roles permitidos
- `@CurrentUser()`: Obtiene usuario autenticado

---

## 9. WEBSOCKETS - CHAT EN TIEMPO REAL

### 9.1 Configuración del Gateway

```typescript
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
  transports: ['polling', 'websocket'],
})
```

### 9.2 Eventos del Sistema

**Cliente a Servidor**:
| Evento | Datos | Descripción |
|--------|-------|-------------|
| startConversation | { subject?: string } | Inicia conversación |
| sendMessage | { conversationId, content } | Envía mensaje |
| markAsRead | { conversationId } | Marca como leído |
| joinConversation | { conversationId } | Une a sala |

**Servidor a Cliente**:
| Evento | Datos | Descripción |
|--------|-------|-------------|
| conversation | Conversation | Conversación creada/actualizada |
| newMessage | Message | Mensaje nuevo |
| unreadCount | { count } | Mensajes no leídos |
| error | { message } | Error |

### 9.3 Autenticación WebSocket

La autenticación se realiza mediante el token JWT enviado en el handshake:

```typescript
const socket = io('/chat', {
  auth: {
    token: 'jwt-token-here'
  }
});
```

---

## 10. CONFIGURACIÓN Y DESPLIEGUE

### 10.1 Variables de Entorno - Backend

```env
# Servidor
NODE_ENV=development
PORT=3001

# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/akemy_db"

# JWT
JWT_SECRET=clave-secreta-jwt
JWT_REFRESH_SECRET=clave-secreta-refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=correo@gmail.com
MAIL_PASS=password-de-aplicacion
MAIL_FROM="AKEMY <noreply@akemy.com>"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 10.2 Variables de Entorno - Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 10.3 Docker Compose

El archivo `docker-compose.yml` define tres servicios:

1. **postgres**: Base de datos PostgreSQL 16
2. **backend**: API NestJS
3. **frontend**: Aplicación Next.js

**Comandos de despliegue**:
```bash
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ejecutar migraciones
docker-compose exec backend npx prisma migrate deploy

# Ejecutar seed
docker-compose exec backend npx prisma db seed
```

### 10.4 Instalación Local

**Backend**:
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

---

## 11. SEGURIDAD

### 11.1 Medidas Implementadas

| Medida | Implementación | Descripción |
|--------|----------------|-------------|
| Autenticación JWT | @nestjs/jwt | Tokens firmados y con expiración |
| Hashing de contraseñas | bcryptjs | Salt rounds: 10 |
| Rate Limiting | @nestjs/throttler | 100 requests/60s por IP |
| CORS | @nestjs/cors | Orígenes permitidos configurados |
| Helmet | helmet | Headers de seguridad HTTP |
| Validación de datos | class-validator | DTOs con decoradores de validación |
| Sanitización | class-transformer | Transformación de datos de entrada |

### 11.2 Headers de Seguridad (Helmet)

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (en producción)

### 11.3 Protección de Rutas

```typescript
// Ruta protegida (requiere autenticación)
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user) { ... }

// Ruta protegida con roles
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
@Post('products')
createProduct() { ... }
```

---

## 12. ANEXOS

### 12.1 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| SuperAdmin | admin@akemy.com | Admin123! |
| Cliente | cliente@test.com | Cliente123! |

### 12.2 Endpoints de Documentación

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

### 12.3 Puertos de Servicios

| Servicio | Puerto |
|----------|--------|
| Frontend | 3000 |
| Backend API | 3001 |
| PostgreSQL | 5432 |
| WebSocket | 3001 (mismo que API) |

### 12.4 Scripts Disponibles

**Backend**:
- `npm run start:dev` - Desarrollo con hot-reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar compilado
- `npx prisma studio` - GUI de base de datos
- `npx prisma migrate dev` - Crear migración
- `npx prisma db seed` - Datos iniciales

**Frontend**:
- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run start` - Ejecutar build
- `npm run lint` - Verificar código

---

## GLOSARIO

| Término | Definición |
|---------|------------|
| API REST | Interfaz de programación basada en HTTP |
| DTO | Data Transfer Object - Objeto para transferencia de datos |
| Guard | Middleware de NestJS para protección de rutas |
| JWT | JSON Web Token - Estándar de tokens de autenticación |
| ORM | Object-Relational Mapping - Mapeo objeto-relacional |
| WebSocket | Protocolo de comunicación bidireccional |
| Middleware | Código que se ejecuta entre la solicitud y la respuesta |
| Seed | Datos iniciales de la base de datos |
| Slug | Versión amigable de una URL |

---

**Fin del Documento**

*Documentación generada para el proyecto AKEMY - Sistema E-commerce*
*Diciembre 2025*
*JuniDev*
