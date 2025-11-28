# AKEMY - Sistema E-commerce para Papelería y Librería

![AKEMY](https://img.shields.io/badge/AKEMY-E--commerce-purple)
![NestJS](https://img.shields.io/badge/NestJS-10.3-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Descripción

AKEMY es un sistema E-commerce completo diseñado para papelerías y librerías. Incluye una tienda online para clientes y un panel de administración completo, inspirado en plataformas como Evershop.

### Características principales

#### 🛒 Tienda (Cliente)
- Catálogo de productos con filtros y búsqueda
- Carrito de compras persistente
- Sistema de autenticación (registro, login, recuperación de contraseña)
- Gestión de pedidos y seguimiento
- Diseño responsive y moderno

#### 👨‍💼 Panel de Administración
- Dashboard con estadísticas de ventas
- Gestión de productos (CRUD, imágenes, variantes, stock)
- Gestión de categorías jerárquicas
- Gestión de marcas
- Gestión de pedidos con flujo de estados
- Gestión de clientes
- Gestión de banners promocionales
- Configuración de la tienda

## 🛠️ Tecnologías

### Backend
- **Framework:** NestJS 10.3
- **Base de datos:** PostgreSQL 16
- **ORM:** Prisma 5.8
- **Autenticación:** JWT + Refresh Tokens
- **Seguridad:** Helmet, CORS, Rate Limiting
- **Documentación:** Swagger/OpenAPI

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 18
- **Estilos:** TailwindCSS 3.4
- **Componentes:** shadcn/ui + Radix UI
- **Estado:** Zustand 5
- **Data Fetching:** TanStack Query 5
- **Formularios:** React Hook Form + Zod

## 📁 Estructura del Proyecto

```
akemy/
├── backend/                 # API REST NestJS
│   ├── prisma/             # Schema y migraciones
│   ├── src/
│   │   ├── auth/           # Autenticación
│   │   ├── users/          # Usuarios
│   │   ├── products/       # Productos
│   │   ├── categories/     # Categorías
│   │   ├── brands/         # Marcas
│   │   ├── orders/         # Pedidos
│   │   ├── cart/           # Carrito
│   │   ├── banners/        # Banners
│   │   ├── settings/       # Configuración
│   │   ├── dashboard/      # Dashboard admin
│   │   ├── upload/         # Subida de archivos
│   │   └── mail/           # Envío de emails
│   └── Dockerfile
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Componentes React
│   │   └── lib/           # Utilidades y API
│   └── Dockerfile
├── docker-compose.yml      # Orquestación Docker
└── README.md
```

## 🚀 Instalación

### Requisitos previos
- Node.js 20+
- PostgreSQL 16+ (o Docker)
- npm o yarn

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd akemy
   ```

2. **Configurar variables de entorno**
   ```bash
   cp backend/.env.example backend/.env
   # Editar backend/.env con tus configuraciones
   ```

3. **Iniciar con Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Ejecutar migraciones y seed**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npx prisma db seed
   ```

5. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Documentación API: http://localhost:3001/api/docs

### Opción 2: Desarrollo Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd akemy
   ```

2. **Configurar Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Editar .env con tu configuración de PostgreSQL
   
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run start:dev
   ```

3. **Configurar Frontend** (en otra terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ⚙️ Configuración

### Variables de entorno del Backend (.env)

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/akemy_db?schema=public"

# JWT
JWT_SECRET="tu-secreto-super-seguro"
JWT_REFRESH_SECRET="tu-secreto-refresh-super-seguro"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (para emails)
FRONTEND_URL="http://localhost:3000"

# Email (SMTP)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="tu-email@gmail.com"
MAIL_PASS="tu-app-password"
MAIL_FROM="noreply@akemy.com"

# Store
STORE_NAME="AKEMY"
```

### Variables de entorno del Frontend

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 👤 Usuarios de Prueba

Después de ejecutar el seed, tendrás los siguientes usuarios:

| Rol | Email | Contraseña |
|-----|-------|------------|
| SuperAdmin | admin@akemy.com | Admin123! |
| Cliente | cliente@test.com | Cliente123! |

## 📚 API Documentation

La documentación interactiva de la API está disponible en:
- **Local:** http://localhost:3001/api/docs
- **Swagger UI** con todos los endpoints documentados

### Endpoints principales

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| Auth | `POST /auth/login` | Iniciar sesión |
| Auth | `POST /auth/register` | Registrar usuario |
| Products | `GET /products` | Listar productos |
| Products | `POST /products` | Crear producto (Admin) |
| Categories | `GET /categories` | Listar categorías |
| Orders | `POST /orders` | Crear pedido |
| Cart | `GET /cart` | Obtener carrito |

## 🔐 Seguridad

- Autenticación JWT con refresh tokens
- Passwords hasheados con bcrypt
- Rate limiting para prevenir ataques
- CORS configurado
- Helmet para headers de seguridad
- Validación de datos con class-validator

## 🚀 Despliegue en Producción

### Recomendaciones

1. **Base de datos:** Usar servicio administrado (AWS RDS, Railway, Supabase)
2. **Backend:** Deploy en Railway, Render, o AWS ECS
3. **Frontend:** Deploy en Vercel (optimizado para Next.js)
4. **Archivos:** Usar S3 o Cloudinary para imágenes
5. **SSL:** Configurar HTTPS obligatorio

### Checklist de producción

- [ ] Cambiar JWT_SECRET y JWT_REFRESH_SECRET
- [ ] Configurar SMTP para emails
- [ ] Configurar CDN para assets
- [ ] Habilitar logs de producción
- [ ] Configurar backups de base de datos
- [ ] Configurar monitoreo (Sentry, New Relic)

## 📝 Licencia

Este proyecto fue desarrollado con fines educativos.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.

---

Desarrollado con ❤️ para AKEMY - Tu papelería favorita
