# Training Management System

Sistema de gestión de entrenamientos y gimnasios construido con NestJS, siguiendo principios de Domain-Driven Design y Arquitectura Hexagonal.

## 🚀 Características Principales

- Gestión completa de gimnasios y entrenadores
- Sistema de reservas y pagos
- Autenticación y autorización de usuarios
- API RESTful con documentación Swagger
- Base de datos PostgreSQL con TypeORM
- Monorepo con estructura modular

## 🏗️ Estructura del Monorepo

```
monorepo-root/
│
├── apps/
│   ├── api-gateway/     # API Gateway principal
│   ├── auth/            # Servicio de autenticación
│   ├── users/           # Gestión de usuarios
│   ├── gyms/            # Gestión de gimnasios
│   ├── trainers/        # Gestión de entrenadores
│   ├── trainer-offert/  # Sistema de ofertas
│   ├── bookings/        # Sistema de reservas
│   ├── payments/        # Procesamiento de pagos
│   ├── routines/        # Gestión de rutinas
│   └── notifications/   # Sistema de notificaciones
│
├── libs/
│   ├── core/           # Entidades, interfaces, casos de uso
│   └── infra/          # Implementaciones técnicas compartidas
│
├── docker-compose.yml
├── .env
└── README.md
```

## 🛠️ Requisitos Previos

- Node.js >= 18.x
- Docker y Docker Compose
- PM2 (para desarrollo local)
- Redis
- PostgreSQL (si se ejecuta sin Docker)

## 🔧 Configuración

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd training-management-system
```

2. Instala dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Ajusta las variables en el archivo `.env` según tu entorno.

## 🚀 Ejecución

### Usando Docker (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Para ejecutar en modo detached
docker-compose up -d

# Para levantar servicios específicos
docker-compose up -d api-gateway auth users

# Para detener los servicios
docker-compose down
```

### Desarrollo Local con PM2

1. Instala PM2 globalmente:
```bash
npm install -g pm2
```

2. Inicia los servicios:
```bash
# Desarrollo - Iniciar todos los servicios
pm2 start ecosystem.config.js

# O iniciar servicios específicos
pm2 start ecosystem.config.js --only api-gateway
pm2 start ecosystem.config.js --only auth
pm2 start ecosystem.config.js --only users

# Producción
pm2 start ecosystem.config.js --env production
```

3. Monitoreo y gestión:
```bash
# Ver estado de todos los servicios
pm2 status

# Monitoreo en tiempo real
pm2 monit

# Ver logs de todos los servicios
pm2 logs

# Ver logs de un servicio específico
pm2 logs api-gateway

# Reiniciar servicios
pm2 restart all
pm2 restart api-gateway

# Detener servicios
pm2 stop all
pm2 stop api-gateway

# Eliminar servicios de PM2
pm2 delete all
```

4. Archivo de configuración PM2 (ecosystem.config.js):
```javascript
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'dist/apps/api-gateway/main.js',
      watch: false,
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'auth',
      script: 'dist/apps/auth/main.js',
      watch: false,
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    },
    {
      name: 'users',
      script: 'dist/apps/users/main.js',
      watch: false,
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 3002
      }
    },
    // ... configuración para otros servicios
  ]
}
```

## 📦 Módulos del Sistema

- **API Gateway**: Punto de entrada centralizado para todas las peticiones
- **Auth**: Gestión de autenticación y autorización
- **Users**: Gestión de usuarios y perfiles
- **Gyms**: Administración de gimnasios y sus instalaciones
- **Trainers**: Gestión de entrenadores y sus especialidades
- **Trainer-Offert**: Sistema de ofertas y propuestas de entrenadores
- **Bookings**: Sistema de reservas y calendario
- **Payments**: Procesamiento de pagos y suscripciones
- **Routines**: Gestión de rutinas y planes de entrenamiento
- **Notifications**: Sistema de notificaciones en tiempo real

## 🏛️ Arquitectura

### Principios Arquitectónicos

- **Arquitectura de Microservicios**
  - Servicios independientes y especializados
  - Comunicación asíncrona mediante Redis pub/sub
  - Comunicación síncrona mediante HTTP/REST
  - API Gateway como punto de entrada único

- **Domain-Driven Design (DDD)**
  - Modelado del dominio basado en el negocio
  - Agregados, entidades y objetos de valor
  - Bounded Contexts para cada microservicio

- **Clean Architecture**
  - Capas bien definidas (Domain, Application, Infrastructure)
  - Inversión de dependencias
  - Separación de responsabilidades

### Patrones y Tecnologías de Comunicación

- Redis pub/sub para comunicación asíncrona entre servicios
- HTTP/Axios para comunicación síncrona entre servicios
- Repository Pattern para acceso a datos
- Factory Pattern para creación de objetos complejos
- Observer Pattern para eventos del dominio

### Estructura del Proyecto

```
monorepo-root/
│
├── apps/
│   ├── api-gateway/     # API Gateway principal
│   ├── auth/            # Servicio de autenticación
│   ├── users/           # Gestión de usuarios
│   ├── gyms/            # Gestión de gimnasios
│   ├── trainers/        # Gestión de entrenadores
│   ├── trainer-offert/  # Sistema de ofertas
│   ├── bookings/        # Sistema de reservas
│   ├── payments/        # Procesamiento de pagos
│   ├── routines/        # Gestión de rutinas
│   └── notifications/   # Sistema de notificaciones
│
├── libs/
│   ├── core/           # Entidades, interfaces, casos de uso
│   └── infra/          # Implementaciones técnicas compartidas
│
├── docker-compose.yml
├── .env
└── README.md
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📚 Documentación

- La documentación de la API está disponible en `/api/docs` cuando el servidor está en ejecución
- Documentación detallada de cada módulo en `apps/api/src/modules/`

## 🔐 Variables de Entorno

```env
# General
NODE_ENV=development                          # development | production
PASSPORT_SECRET=your-passport-secret          # Secreto para Passport.js

# Frontend
FRONTEND_URL=http://localhost:3000            # URL del frontend para enlaces en emails

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=training_system

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret                    # Secreto general para JWT
JWT_ACCESS_SECRET=your-access-token-secret    # Secreto para tokens de acceso
JWT_REFRESH_SECRET=your-refresh-token-secret  # Secreto para tokens de refresh
JWT_RESET_SECRET=your-reset-token-secret      # Secreto para tokens de reset password
JWT_ACCESS_EXPIRATION=15m                     # Tiempo de expiración del token de acceso
JWT_REFRESH_EXPIRATION=7d                     # Tiempo de expiración del token de refresh
JWT_RESET_EXPIRATION=1h                       # Tiempo de expiración del token de reset

# Servicios - URLs
API_GATEWAY_PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
USERS_SERVICE_URL=http://localhost:3002
GYMS_SERVICE_URL=http://localhost:3003
BOOKINGS_SERVICE_URL=http://localhost:3004
PAYMENTS_SERVICE_URL=http://localhost:3005
TRAINERS_SERVICE_URL=http://localhost:3006
TRAINER_OFFERT_SERVICE_URL=http://localhost:3007
ROUTINES_SERVICE_URL=http://localhost:3008
NOTIFICATIONS_SERVICE_URL=http://localhost:3009

# Servicios - Puertos
PORT_AUTH=3001
PORT_USERS=3002
PORT_GYMS=3003
PORT_BOOKINGS=3004
PORT_PAYMENTS=3005
PORT_TRAINERS=3006
PORT_TRAINER_OFFERT=3007
PORT_ROUTINES=3008
PORT_NOTIFICATIONS=3009

# AWS (Para notificaciones por email)
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SES_FROM_EMAIL=no-reply@yourdomain.com

# Google Maps (Para direcciones)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Logging
LOG_LEVEL=debug                               # debug | info (automático según NODE_ENV)
```

> **Nota**: Asegúrate de nunca compartir tus claves secretas o credenciales. El archivo `.env` está incluido en `.gitignore` por seguridad.

