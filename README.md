<div align="center">
  
  <img src="frontend/public/logoakemy.jpg" alt="AKEMY" width="180" style="border-radius: 20px;"/>

  # 🐱 AKEMY
  ### **Librería y Papelería Online**
  
  *Tu papelería favorita • Útiles escolares, artículos de oficina y más*

  <br/>

  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-akemy.app-C84B4B?style=for-the-badge)](https://akemy.app)
  [![API Docs](https://img.shields.io/badge/📚_API_Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://akemy-backend.onrender.com/api/docs)
  
  <br/>
  
  ![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?style=flat-square&logo=nestjs&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-5.8-2D3748?style=flat-square&logo=prisma&logoColor=white)
  ![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io&logoColor=white)
  ![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Integrated-009ee3?style=flat-square&logo=mercadopago&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
  
</div>

<br/>

## 🎯 Descripción

**AKEMY** es un sistema e-commerce moderno y completo diseñado para papelerías y librerías en Perú. Desarrollado con las últimas tecnologías web, ofrece una experiencia de compra fluida para clientes y un potente panel de administración para gestionar el negocio.

<br/>

---

## ✨ Características Principales

<table>
<tr>
<td width="50%" valign="top">

### 🛒 Tienda Online

- 📦 Catálogo con filtros y búsqueda avanzada
- 🛍️ Carrito de compras persistente
- 💳 **Pagos con Mercado Pago** (tarjetas)
- 💵 Pago contra entrega
- 👤 Autenticación completa (JWT + Refresh Tokens)
- 📧 Verificación por email con Resend
- 🔄 Recuperación de contraseña
- 📋 Seguimiento de pedidos en tiempo real
- ❤️ Lista de deseos (Wishlist)
- ⭐ Sistema de reseñas con moderación
- 🔍 Comparador de productos (hasta 4)
- 🏷️ Ofertas y promociones activas
- 🎟️ Cupones de descuento
- 🔄 Solicitud de devoluciones
- 🎁 Programa de puntos de fidelidad
- 💬 **Chat en tiempo real** con soporte
- 🔔 Notificaciones con sonido
- 📱 Diseño 100% responsive

</td>
<td width="50%" valign="top">

### 👨‍💼 Panel de Administración

- 📊 Dashboard con estadísticas de ventas
- 📦 Gestión de productos (CRUD completo)
- 🏷️ Gestión de categorías jerárquicas
- 🏢 Gestión de marcas
- 📋 Flujo de estados de pedidos
- 👥 Gestión de clientes
- 🖼️ Gestión de banners promocionales
- 🎯 Gestión de ofertas por fechas
- 🎟️ Gestión de cupones
- ⭐ Moderación de reseñas
- 🔄 Gestión de devoluciones
- 💬 **Panel de chat para soporte**
- ⚙️ Configuración de pagos y tienda
- 📈 Reportes y métricas
- 🔐 Control de acceso por roles

</td>
</tr>
</table>

<br/>

---

## 🛡️ Seguridad Implementada

| Característica | Descripción |
|----------------|-------------|
| 🔐 **JWT + Refresh Tokens** | Autenticación segura con tokens de corta duración |
| 🛡️ **Helmet** | Headers de seguridad HTTP (CSP, HSTS, XSS Protection) |
| 🚫 **Rate Limiting** | Protección contra ataques de fuerza bruta |
| 🧹 **Sanitización XSS** | Limpieza de inputs con `sanitize-html` |
| 🔒 **Bcrypt** | Hashing seguro de contraseñas |
| 🌐 **CORS** | Configuración estricta de orígenes permitidos |
| ✅ **Validación** | DTOs con `class-validator` en todos los endpoints |

<br/>

---

## 🛠️ Stack Tecnológico

<table>
<tr>
<td align="center" width="50%">

### 🔧 Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 10.3 | Framework API |
| Prisma | 5.8 | ORM |
| PostgreSQL | 16 | Base de datos |
| Socket.io | 4.8 | WebSockets |
| Mercado Pago SDK | 2.11 | Pagos |
| Resend | 6.6 | Emails |
| Swagger | 7.2 | Documentación |

</td>
<td align="center" width="50%">

### 🎨 Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15 | Framework React |
| React | 18 | UI Library |
| TailwindCSS | 3.4 | Estilos |
| shadcn/ui | Latest | Componentes |
| Zustand | 5 | Estado global |
| TanStack Query | 5 | Data fetching |
| React Hook Form | Latest | Formularios |

</td>
</tr>
</table>

<br/>

---

## 🚀 Despliegue en Producción

El proyecto está desplegado y funcionando en:

| Servicio | Plataforma | URL |
|----------|------------|-----|
| 🌐 Frontend | **Vercel** | [akemy.app](https://akemy.app) |
| ⚙️ Backend | **Render** | [akemy-backend.onrender.com](https://akemy-backend.onrender.com) |
| 🗄️ Database | **Neon** | PostgreSQL Serverless |
| 💳 Pagos | **Mercado Pago** | Integración completa |
| 📧 Emails | **Resend** | Transaccionales |

<br/>

---

## 📁 Estructura del Proyecto

```
akemy/
├── 📂 backend/                    # API REST NestJS
│   ├── prisma/                   # Schema y migraciones
│   ├── src/
│   │   ├── auth/                 # 🔐 Autenticación JWT
│   │   ├── users/                # 👤 Usuarios
│   │   ├── products/             # 📦 Productos
│   │   ├── categories/           # 🏷️ Categorías
│   │   ├── brands/               # 🏢 Marcas
│   │   ├── orders/               # 📋 Pedidos
│   │   ├── cart/                 # 🛒 Carrito
│   │   ├── payments/             # 💳 Mercado Pago
│   │   ├── chat/                 # 💬 Chat WebSockets
│   │   ├── offers/               # 🎯 Ofertas
│   │   ├── coupons/              # 🎟️ Cupones
│   │   ├── reviews/              # ⭐ Reseñas
│   │   ├── wishlist/             # ❤️ Lista de deseos
│   │   ├── returns/              # 🔄 Devoluciones
│   │   ├── comparison/           # 🔍 Comparador
│   │   ├── loyalty/              # 🎁 Puntos
│   │   ├── mail/                 # 📧 Emails (Resend)
│   │   ├── settings/             # ⚙️ Configuración
│   │   ├── dashboard/            # 📊 Dashboard
│   │   ├── upload/               # 📤 Archivos
│   │   └── common/               # 🛡️ Pipes, Guards
│   └── Dockerfile
│
├── 📂 frontend/                   # Next.js 15 App
│   ├── public/
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── (shop)/           # Páginas tienda
│   │   │   ├── admin/            # Panel admin
│   │   │   ├── checkout/         # Checkout + pagos
│   │   │   └── cuenta/           # Área cliente
│   │   ├── components/           # Componentes UI
│   │   └── lib/                  # Utils, API, Store
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

<br/>

---

## ⚡ Instalación Local

### Requisitos
- Node.js 20+
- PostgreSQL 16+ (o Docker)
- NPM o Yarn

### 🐳 Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/BeltranHC/ecomerce_akemy.git
cd akemy

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env

# 3. Iniciar con Docker Compose
docker-compose up -d

# 4. Ejecutar migraciones
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### 💻 Desarrollo Local

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

<br/>

---

## ⚙️ Variables de Entorno

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3001

# Database (Neon con pooling)
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# JWT
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
FRONTEND_URL=https://akemy.app

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxx
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxx
BACKEND_URL=https://akemy-backend.onrender.com

# Resend (Emails)
RESEND_API_KEY=re_xxx
EMAIL_FROM="AKEMY <noreply@akemy.app>"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://akemy-backend.onrender.com
```

<br/>

---

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| 🔴 SuperAdmin | `admin@akemy.com` | `Admin123!` |
| 🟢 Cliente | `cliente@test.com` | `Cliente123!` |

<br/>

---

## 💳 Tarjetas de Prueba (Mercado Pago)

| Tipo | Número | CVV | Vencimiento |
|------|--------|-----|-------------|
| ✅ Visa (Aprobada) | `4509 9535 6623 3704` | `123` | Cualquier fecha futura |
| ✅ Mastercard (Aprobada) | `5031 7557 3453 0604` | `123` | Cualquier fecha futura |

<br/>

---

## 📚 API Endpoints

La documentación completa está en **Swagger**: [/api/docs](https://akemy-backend.onrender.com/api/docs)

<details>
<summary><b>🔐 Autenticación</b></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/admin/login` | Login admin |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/forgot-password` | Recuperar contraseña |

</details>

<details>
<summary><b>📦 Productos</b></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products` | Listar productos |
| GET | `/products/:slug` | Detalle producto |
| POST | `/products` | Crear (Admin) |
| PATCH | `/products/:id` | Actualizar (Admin) |
| DELETE | `/products/:id` | Eliminar (Admin) |

</details>

<details>
<summary><b>💳 Pagos</b></summary>

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/payments/create-preference` | Crear preferencia MP |
| POST | `/payments/webhook` | Webhook MP |
| GET | `/payments/status/:id` | Estado del pago |

</details>

<details>
<summary><b>💬 Chat WebSocket</b></summary>

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join-room` | Cliente → Server | Unirse a sala |
| `send-message` | Cliente → Server | Enviar mensaje |
| `new-message` | Server → Cliente | Mensaje nuevo |
| `typing` | Bidireccional | Indicador escritura |

</details>

<br/>

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| 🔴 Rojo Coral | `#C84B4B` | Principal, botones, acentos |
| 🔴 Rojo Oscuro | `#a83e3e` | Hover states |
| ⚪ Blanco | `#FFFFFF` | Fondos, textos |
| ⚫ Gris | `#F9FAFB` | Fondos secundarios |

<br/>

---

## 👨‍💻 Desarrollador

<div align="center">
  
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=C84B4B&center=true&vCenter=true&width=500&lines=Hola%2C+soy+Juni+Dev+%F0%9F%91%8B;Full+Stack+Developer+%F0%9F%9A%80" alt="Typing SVG" />

  <br/><br/>
  
  ### 🚀 Junior Huaraya
  **Full Stack Developer**
  
  <br/>
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BeltranHC)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/junior-huaraya/)
  [![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:huaraya0804@email.com)

  <br/>

  ---

  💡 *"El código limpio no se escribe siguiendo un conjunto de reglas. El profesionalismo y la artesanía provienen de valores que impulsan las disciplinas."* - Robert C. Martin

  ---

  ### 🛠️ Tech Stack Personal

  ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

<br/>

---

<div align="center">
  
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=20&duration=4000&pause=1000&color=C84B4B&center=true&vCenter=true&width=600&lines=Gracias+por+visitar+este+proyecto+%E2%9D%A4%EF%B8%8F;Librer%C3%ADa+AKEMY+-+Tu+papeler%C3%ADa+favorita+%F0%9F%90%B1" alt="Footer" />
  
  <br/><br/>
  
  **⭐ Si te gustó este proyecto, no olvides darle una estrella ⭐**
  
  <br/>
  
  *Útiles escolares • Artículos de oficina • Arte y manualidades*
  
  <br/>
  
  ![Visitors](https://api.visitorbadge.io/api/visitors?path=BeltranHC%2Fecomerce_akemy&label=Visitantes&countColor=%23C84B4B)
  
  <br/>
  
  **© 2025 AKEMY - Todos los derechos reservados**
  
</div>
