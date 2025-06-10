# 🚀 Guía de Despliegue - Training Management System

Esta guía te muestra cómo ejecutar cada uno de los microservicios del sistema tanto en modo desarrollo como en producción usando Docker.

## 📋 Prerrequisitos

- Node.js 18+
- npm o pnpm
- Docker y Docker Compose
- PostgreSQL (si ejecutas sin Docker)

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por 6 microservicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **users** | 3001 | Gestión de usuarios y perfiles |
| **auth** | 3002 | Autenticación y autorización |
| **gyms** | 3003 | Gestión de gimnasios |
| **bookings** | 3004 | Reservas y citas |
| **payments** | 3005 | Procesamiento de pagos |
| **trainers** | 3006 | Gestión de entrenamientos |

## 🔧 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
# o
pnpm install
```

### 2. Configurar Base de Datos
```bash
# Generar cliente Prisma
npm run build:generate

# Ejecutar migraciones
npm run build:migrate
```

### 3. Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://devuser:devpass@localhost:5432/trainingdb"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
PASSPORT_SECRET="your-passport-secret"

# Ports
PORT_USERS=3001
PORT_AUTH=3002
PORT_GYMS=3003
PORT_BOOKINGS=3004
PORT_PAYMENTS=3005
PORT_TRAININGS=3006

NODE_ENV=development
```

## 🖥️ Ejecución en Modo Desarrollo

### Ejecutar Todos los Servicios Individualmente

```bash
# En terminales separadas:
npm run start:users      # Puerto 3001
npm run start:auth       # Puerto 3002
npm run start:gyms       # Puerto 3003
npm run start:bookings   # Puerto 3004
npm run start:payments   # Puerto 3005
npm run start:trainers  # Puerto 3006
```

### Ejecutar Un Servicio Específico

```bash
# Modo desarrollo con hot reload
npm run start:gyms

# Modo debug
npm run start:gyms:debug
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Test de un servicio específico
npm run test:gyms
npm run test:users
npm run test:auth
```

## 🐳 Ejecución con Docker

### 1. Ejecutar Solo la Base de Datos
```bash
# Iniciar PostgreSQL
docker-compose up -d postgres

# Verificar que está funcionando
docker-compose logs postgres
```

### 2. Ejecutar Todos los Servicios
```bash
# Construir e iniciar todos los servicios
npm run docker:build
npm run docker:up

# Ver logs
npm run docker:logs

# Ver logs de un servicio específico
docker-compose logs -f gyms-service
```

### 3. Ejecutar Servicios Individuales
```bash
# Solo el servicio de gimnasios
docker-compose up -d postgres gyms-service

# Solo autenticación y usuarios
docker-compose up -d postgres auth-service users-service
```

### 4. Comandos Útiles de Docker
```bash
# Parar todos los servicios
npm run docker:down

# Reiniciar servicios
npm run docker:restart

# Ver estado de los servicios
docker-compose ps

# Acceder a logs en tiempo real
docker-compose logs -f

# Reconstruir un servicio específico
docker-compose build gyms-service
docker-compose up -d gyms-service
```

## 🌐 API Gateway con Nginx

El sistema incluye un API Gateway con Nginx que centraliza todas las APIs:

### URLs del API Gateway
- **Base URL**: `http://localhost`
- **Users API**: `http://localhost/api/users`
- **Auth API**: `http://localhost/api/auth`
- **Gyms API**: `http://localhost/api/gyms`
- **Bookings API**: `http://localhost/api/bookings`
- **Payments API**: `http://localhost/api/payments`
- **Trainings API**: `http://localhost/api/trainers`
- **Documentación**: `http://localhost/docs`

### URLs Directas de los Servicios
- Users: `http://localhost:3001`
- Auth: `http://localhost:3002`
- Gyms: `http://localhost:3003`
- Bookings: `http://localhost:3004`
- Payments: `http://localhost:3005`
- Trainings: `http://localhost:3006`

## 🔨 Build para Producción

### Build Individual
```bash
# Construir un servicio específico
npm run build:gyms
npm run build:users

# Construir todos los servicios
npm run build:all
```

### Ejecutar en Producción
```bash
# Después del build
npm run start:gyms:prod
npm run start:users:prod
```

## 📊 Monitoreo y Health Checks

### Health Checks Disponibles
Cada servicio expone un endpoint de health check:

```bash
# API Gateway
curl http://localhost/health

# Servicios individuales
curl http://localhost:3001/health  # Users
curl http://localhost:3003/health  # Gyms
# ... etc
```

### Ver Estado de los Contenedores
```bash
# Estado de todos los servicios
docker-compose ps

# Logs específicos
docker-compose logs -f gyms-service

# Estadísticas de recursos
docker stats
```

## 🧪 Testing y Desarrollo

### Ejecutar Tests con Coverage
```bash
# Coverage general
npm test -- --coverage

# Coverage de un servicio específico
npm run test:gyms -- --coverage
npm run test:users -- --coverage
```

### Debug de un Servicio
```bash
# Modo debug (puerto 9229)
npm run start:gyms:debug

# En VS Code, adjuntar debugger al puerto 9229
```

## 🔧 Comandos de Mantenimiento

### Base de Datos
```bash
# Aplicar migraciones
npm run build:migrate

# Regenerar cliente Prisma
npm run build:generate

# Reset completo de la BD (¡CUIDADO!)
npx prisma migrate reset
```

### Limpiar y Reinstalar
```bash
# Limpiar node_modules
rm -rf node_modules
npm install

# Limpiar Docker
docker-compose down -v
docker system prune -f
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Puerto ya en uso**
   ```bash
   # Verificar qué está usando el puerto
   lsof -i :3003
   
   # Cambiar puerto en .env
   PORT_GYMS=3007
   ```

2. **Error de conexión a BD**
   ```bash
   # Verificar que PostgreSQL esté ejecutándose
   docker-compose ps postgres
   
   # Reiniciar servicio de BD
   docker-compose restart postgres
   ```

3. **Error de permisos en Docker**
   ```bash
   # En Linux/Mac, puede necesitar sudo
   sudo docker-compose up -d
   ```

4. **Problemas de memoria**
   ```bash
   # Aumentar memoria de Docker
   # Docker Desktop > Settings > Resources > Memory
   
   # Limpiar recursos no utilizados
   docker system prune -f
   ```

### Logs de Debugging
```bash
# Ver logs detallados
docker-compose logs -f --tail=100 gyms-service

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs desde el inicio
docker-compose logs --since="1h" gyms-service
```

## 🎯 Ejemplos de Uso

### Iniciar Sistema Completo para Desarrollo
```bash
# 1. Iniciar base de datos
docker-compose up -d postgres

# 2. Aplicar migraciones
npm run build:migrate

# 3. Iniciar servicios en terminales separadas
npm run start:auth      # Terminal 1
npm run start:users     # Terminal 2  
npm run start:gyms      # Terminal 3
```

### Iniciar con Docker para Testing
```bash
# Sistema completo con un comando
npm run docker:up

# Verificar que todo esté funcionando
curl http://localhost/health
```

### Deploy de Producción
```bash
# 1. Build de todas las aplicaciones
npm run build:all

# 2. Ejecutar en modo producción
npm run start:users:prod &
npm run start:auth:prod &
npm run start:gyms:prod &
# ... etc

# O con Docker
docker-compose -f docker-compose.prod.yml up -d
```

Esta guía debería cubrir todos los escenarios de desarrollo y despliegue. Para problemas específicos, revisa los logs individuales de cada servicio. 