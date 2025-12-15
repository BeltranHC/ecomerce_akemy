# 🐱 AKEMY - Librería y Papelería Online

<div align="center">
  <img src="frontend/public/logoakemy.jpg" alt="Librería Akemy" width="200"/>
  
  **Tu papelería favorita - Útiles escolares, artículos de oficina y más**
</div>

![AKEMY](https://img.shields.io/badge/AKEMY-Librer%C3%ADa-C84B4B)
![NestJS](https://img.shields.io/badge/NestJS-10.3-red)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![WebSockets](https://img.shields.io/badge/WebSockets-Socket.io-green)

## 📋 Descripción

**Librería AKEMY** es un sistema E-commerce completo diseñado para papelerías y librerías en Perú. Ofrece una amplia variedad de útiles escolares, artículos de oficina, arte y manualidades. Incluye una tienda online moderna para clientes y un panel de administración completo.

### ✨ Características principales

#### 🛒 Tienda (Cliente)
- Catálogo de productos con filtros y búsqueda avanzada
- Carrito de compras persistente
- Sistema de autenticación (registro, login, recuperación de contraseña)
- Gestión de pedidos y seguimiento
- Lista de deseos (Wishlist)
- Reseñas de productos (con moderación)
- Comparador de productos (máx. 4)
- Ofertas y promociones activas
- Cupones de descuento
- Solicitud de devoluciones
- Puntos de fidelidad (consulta de saldo e historial)
- **💬 Chat en tiempo real con soporte** (WebSockets)
- 🔔 Notificaciones con sonido
- Diseño responsive y moderno con tema rojo coral
- Páginas de login/registro con animaciones de útiles escolares

#### 👨‍💼 Panel de Administración
- Dashboard con estadísticas de ventas
- Gestión de productos (CRUD, imágenes, variantes, stock)
- Gestión de categorías jerárquicas
- Gestión de marcas
- Gestión de pedidos con flujo de estados
- Gestión de clientes
- Gestión de banners promocionales
- Gestión de ofertas (promociones por rango de fechas)
- Gestión de cupones
- Moderación de reseñas
- Gestión de solicitudes de devolución
- **💬 Panel de chat para atención al cliente**
- Configuración de la tienda

#### 📦 Categorías de Productos
- ✏️ Útiles Escolares
- 🖥️ Artículos de Oficina
- 🎨 Arte y Manualidades
- 📚 Cuadernos y Libretas
- Y mucho más...

## 🛠️ Tecnologías

### Backend
- **Framework:** NestJS 10.3
- **Base de datos:** PostgreSQL 16
- **ORM:** Prisma 5.8
- **Autenticación:** JWT + Refresh Tokens
- **WebSockets:** Socket.io + @nestjs/websockets
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
- **WebSockets:** socket.io-client

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
│   │   ├── chat/           # 💬 Chat en tiempo real (WebSockets)
│   │   ├── banners/        # Banners
│   │   ├── wishlist/       # Lista de deseos
│   │   ├── offers/         # Ofertas y promociones
│   │   ├── coupons/        # Cupones
│   │   ├── reviews/        # Reseñas y moderación
│   │   ├── returns/        # Solicitud/gestión de devoluciones
│   │   ├── comparison/     # Comparador de productos
│   │   ├── loyalty/        # Puntos de fidelidad
│   │   ├── settings/       # Configuración
│   │   ├── dashboard/      # Dashboard admin
│   │   ├── upload/         # Subida de archivos
│   │   └── mail/           # Envío de emails
│   └── Dockerfile
├── frontend/               # Aplicación Next.js
│   ├── public/
│   │   └── logoakemy.jpg   # Logo de la tienda
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    
│   │   │   ├── chat/      # 💬 Componentes de chat
│   │   │   ├── admin/     # Panel administrativo
│   │   │   └── ...
│   │   └── lib/           
│   │       ├── socket.tsx # Proveedor de WebSockets
│   │       └── ...
│   └── Dockerfile
├── docker-compose.yml      # Orquestación Docker
└── README.md
```

## 🎨 Paleta de Colores

El diseño utiliza una paleta inspirada en el logo del gatito:

| Color | Hex | Uso |
|-------|-----|-----|
| Rojo Coral | `#C84B4B` | Color principal, botones, acentos |
| Rojo Oscuro | `#a83e3e` | Hover states |
| Blanco | `#FFFFFF` | Fondos, textos sobre rojo |
| Gris Claro | `#F9FAFB` | Fondos secundarios |

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
# Configuración del Servidor
NODE_ENV=development
PORT=3001

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/akemy_db?schema=public"

# JWT
JWT_SECRET=tu-secreto-super-seguro
JWT_REFRESH_SECRET=tu-secreto-refresh-super-seguro
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000

# Configuración de Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_password_de_aplicacion
SMTP_FROM="AKEMY Papelería <noreply@akemy.com>"

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
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
| Wishlist | `GET /wishlist` | Ver lista de deseos |
| Offers | `GET /offers/active` | Ofertas activas (público) |
| Coupons | `POST /coupons/validate` | Validar cupón y obtener descuento |
| Reviews | `GET /reviews/product/:productId` | Reseñas aprobadas de un producto (público) |
| Returns | `GET /returns/my` | Mis devoluciones |
| Comparison | `GET /comparison` | Listar productos en comparador |
| Loyalty | `GET /loyalty/balance` | Consultar puntos |
| Chat | `GET /chat/conversations` | Listar conversaciones |
| Chat | `POST /chat/conversations` | Crear conversación |

## 📜 Scripts útiles

### Backend

- **`npm run start:dev`**: iniciar API en modo desarrollo
- **`npm run build`**: compilar
- **`npm run prisma:migrate`**: migraciones (dev)
- **`npm run prisma:seed`**: seed
- **`npm run prisma:studio`**: Prisma Studio

### Frontend

- **`npm run dev`**: iniciar Next.js en modo desarrollo
- **`npm run build`**: build
- **`npm run start`**: correr build
- **`npm run lint`**: lint
- **`npm run format`**: formateo con Prettier

### WebSocket Events

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join-room` | Cliente → Servidor | Unirse a sala de chat |
| `send-message` | Cliente → Servidor | Enviar mensaje |
| `new-message` | Servidor → Cliente | Recibir mensaje nuevo |
| `typing` | Bidireccional | Indicador de escritura |
| `notification` | Servidor → Cliente | Notificación general |

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

## 👨‍💻 Desarrollador

<div align="center">
  
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=C84B4B&center=true&vCenter=true&width=500&lines=Hola%2C+soy+Juni+Dev+%F0%9F%91%8B;Full+Stack+Developer+%F0%9F%9A%80;Apasionado+por+el+c%C3%B3digo+%F0%9F%92%BB" alt="Typing SVG" />

  <br/>
  
  ### 🚀 Juni Dev
  **Full Stack Developer Junior**
  
  <p>
    <a href="https://github.com/BeltranHC">
      <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
    </a>
    <a href="https://www.linkedin.com/in/junior-huaraya/">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
    </a>
    <a href="mailto:huaraya0804@email.com">
      <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
    </a>
  </p>

  ---
  
  💡 *"El código limpio no se escribe siguiendo un conjunto de reglas. No te conviertes en un artesano del software aprendiendo una lista de heurísticas. El profesionalismo y la artesanía provienen de valores que impulsan las disciplinas."* - Robert C. Martin

  ---

  ### 🛠️ Tech Stack

  ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
  ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)

  ---

</div>

---

<div align="center">
  
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=24&duration=4000&pause=1000&color=C84B4B&center=true&vCenter=true&width=600&lines=Gracias+por+visitar+este+proyecto+%E2%9D%A4%EF%B8%8F;Librer%C3%ADa+AKEMY+-+Tu+papeler%C3%ADa+favorita+%F0%9F%90%B1" alt="Footer Typing SVG" />
  
  <br/><br/>
  
  **⭐ Si te gustó este proyecto, no olvides darle una estrella ⭐**
  
  <br/>
  
  *Útiles escolares • Artículos de oficina • Arte y manualidades*
  
  <br/>
  
  ![Visitors](https://api.visitorbadge.io/api/visitors?path=BeltranHC%2Fecomerce_akemy&label=Visitantes&countColor=%23C84B4B)
  
</div>
