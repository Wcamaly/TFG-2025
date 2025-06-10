# 🚀 Guía de PM2 para Desarrollo - Training Management System

Esta guía te ayudará a usar PM2 para gestionar todos los microservicios en **desarrollo** de manera eficiente.

## 📋 Prerequisitos

1. **Variables de Entorno**: Copia `env.example` a `.env` y configura tus variables:
   ```bash
   cp env.example .env
   ```

2. **Base de Datos**: Asegúrate de que tu base de datos PostgreSQL esté ejecutándose:
   ```bash
   npm run docker:up  # Si usas Docker
   # O configura tu PostgreSQL local
   ```

3. **Dependencias**: Instala todas las dependencias:
   ```bash
   pnpm install
   ```

## 🏃‍♂️ Comandos Rápidos

### ✨ Iniciar Todos los Servicios
```bash
npm run dev
```

### 📊 Ver Estado de Todos los Servicios
```bash
npm run pm2:status
```

### 📝 Ver Logs de Todos los Servicios
```bash
npm run pm2:logs
```

### ⏹️ Detener Todos los Servicios
```bash
npm run dev:stop
```

## 🌟 API Gateway y Servicios Disponibles

### 🚪 API Gateway - Punto de Entrada Principal
| Servicio     | Puerto | Descripción                           | Comando Individual          |
|--------------|--------|---------------------------------------|-----------------------------|
| **API Gateway** | **3000** | **Punto de entrada unificado** | `npm run start:gateway`     |

**📚 Swagger Unificado**: `http://localhost:3000/api`

### 🏗️ Microservicios Individuales
| Servicio   | Puerto | Descripción                    | Comando Individual        |
|------------|--------|--------------------------------|---------------------------|
| Users      | 3001   | Gestión de usuarios            | `npm run start:users`     |
| Auth       | 3002   | Autenticación y autorización   | `npm run start:auth`      |
| Gyms       | 3003   | Gestión de gimnasios           | `npm run start:gyms`      |
| Bookings   | 3004   | Sistema de reservas            | `npm run start:bookings`  |
| Payments   | 3005   | Procesamiento de pagos         | `npm run start:payments`  |
| Trainings  | 3006   | Gestión de entrenamientos      | `npm run start:trainers` |

## 🔧 Comandos Detallados

### 🌟 Gestión del API Gateway
```bash
# Iniciar SOLO el API Gateway
npm run pm2:start:gateway

# Iniciar SOLO los microservicios (sin gateway)
npm run pm2:start:services

# Iniciar TODO (gateway + microservicios)
npm run pm2:start:all

# Logs del API Gateway
npm run pm2:logs:gateway

# Restart del API Gateway
npm run pm2:restart:gateway

# Stop del API Gateway  
npm run pm2:stop:gateway
```

### Gestión General
```bash
# Iniciar todos los servicios (método tradicional)
npm run pm2:start

# Parar todos los servicios
npm run pm2:stop

# Reiniciar todos los servicios
npm run pm2:restart

# Ver estado detallado
npm run pm2:status

# Monitor en tiempo real
npm run pm2:monitor
```

### 📝 Logs Específicos por Servicio
```bash
npm run pm2:logs:gateway    # Logs del API Gateway
npm run pm2:logs:users      # Logs del servicio Users
npm run pm2:logs:auth       # Logs del servicio Auth
npm run pm2:logs:gyms       # Logs del servicio Gyms
npm run pm2:logs:bookings   # Logs del servicio Bookings
npm run pm2:logs:payments   # Logs del servicio Payments
npm run pm2:logs:trainers   # Logs del servicio Trainings
```

### 🎛️ Gestión Individual de Servicios
```bash
# Reiniciar un servicio específico
pm2 restart users-dev
pm2 restart auth-dev
pm2 restart gyms-dev

# Parar un servicio específico
pm2 stop users-dev

# Ver información detallada de un servicio
pm2 describe users-dev
```

### 🧹 Limpieza y Mantenimiento
```bash
# Limpiar todos los logs
npm run pm2:flush

# Reset de estadísticas
npm run pm2:reset
```

## 🌍 Variables de Entorno

Configura estas variables en tu archivo `.env`:

```bash
# Base de Datos
DATABASE_URL="postgresql://username:password@localhost:5432/training_management_db"

# JWT y Seguridad
JWT_SECRET="tu-clave-secreta-jwt-super-segura"
PASSPORT_SECRET="tu-clave-secreta-passport"

# API Gateway
API_GATEWAY_PORT=3000

# Puertos de Servicios
PORT_USERS=3001
PORT_AUTH=3002
PORT_GYMS=3003
PORT_BOOKINGS=3004
PORT_PAYMENTS=3005
PORT_TRAININGS=3006

# URLs de Microservicios (para API Gateway)
AUTH_SERVICE_URL=http://localhost:3002
USERS_SERVICE_URL=http://localhost:3001
TRAINERS_SERVICE_URL=http://localhost:3006
GYMS_SERVICE_URL=http://localhost:3003
BOOKINGS_SERVICE_URL=http://localhost:3004
PAYMENTS_SERVICE_URL=http://localhost:3005

# Entorno
NODE_ENV=development
```

## 🔍 Debugging y Troubleshooting

### Ver Logs en Tiempo Real
```bash
# Todos los servicios
pm2 logs

# Un servicio específico
pm2 logs users-dev

# Últimas 50 líneas de logs
pm2 logs --lines 50
```

### Información Detallada de Procesos
```bash
# Ver información completa de un proceso
pm2 describe users-dev

# Ver uso de memoria y CPU
pm2 monit
```

### Problemas Comunes

1. **Puerto en uso**: 
   ```bash
   # Verificar qué proceso usa el puerto
   lsof -i :3001
   
   # Cambiar puerto en .env si es necesario
   ```

2. **Servicios no inician**:
   ```bash
   # Ver logs de error
   pm2 logs users-dev --err
   
   # Verificar configuración
   pm2 describe users-dev
   ```

3. **Alto uso de memoria**:
   ```bash
   # Los servicios se reiniciarán automáticamente si superan 1GB
   # Configurado en ecosystem.config.js
   ```

## 📁 Estructura de Logs

Los logs se guardan en el directorio `./logs/`:

```
logs/
├── api-gateway-dev-error.log    # Errores del API Gateway
├── api-gateway-dev-out.log      # Output del API Gateway  
├── api-gateway-dev.log          # Log combinado del API Gateway
├── users-dev-error.log          # Errores del servicio Users
├── users-dev-out.log            # Output del servicio Users
├── users-dev.log                # Log combinado del servicio Users
├── auth-dev-error.log           # Errores del servicio Auth
├── auth-dev-out.log             # Output del servicio Auth
├── auth-dev.log                 # Log combinado del servicio Auth
└── ... (otros servicios)
```

## 🎯 Consejos de Desarrollo

### 🌟 Con API Gateway:
1. **Desarrollo Completo**: Usa `npm run pm2:start:all` para iniciar gateway + microservicios
2. **Solo Gateway**: Usa `npm run pm2:start:gateway` para desarrollar solo el proxy
3. **Solo Microservicios**: Usa `npm run pm2:start:services` para desarrollo sin gateway
4. **Swagger Unificado**: Accede a `http://localhost:3000/api` para documentación completa

### 🔧 Generales:
1. **Inicio Rápido**: Usa `npm run dev` para iniciar todos los servicios (método tradicional)
2. **Debugging**: Usa `npm run pm2:logs:nombre-servicio` para debuggear servicios específicos
3. **Performance**: Usa `pm2 monit` para monitorear recursos
4. **Gateway Debugging**: Usa `npm run pm2:logs:gateway` para debuggear el proxy
4. **Logs**: Limpia logs regularmente con `npm run pm2:flush`
5. **Hot Reload**: NestJS maneja automáticamente los cambios de código

## 🚨 Comandos de Emergencia

```bash
# Parar TODO y limpiar
pm2 kill

# Iniciar desde cero
npm run dev

# Si algo está muy mal, reiniciar PM2 daemon
pm2 kill
pm2 resurrect
```

## 📞 URLs de los Servicios

Una vez iniciados, tus servicios estarán disponibles en:

- **Users Service**: http://localhost:3001
- **Auth Service**: http://localhost:3002  
- **Gyms Service**: http://localhost:3003
- **Bookings Service**: http://localhost:3004
- **Payments Service**: http://localhost:3005
- **Trainings Service**: http://localhost:3006

Cada servicio tendrá su documentación Swagger en `/api/docs`.

## 🚀 Flujo de Trabajo Recomendado

```bash
# 1. Configurar entorno
cp env.example .env
# Editar .env con tus configuraciones

# 2. Instalar dependencias
pnpm install

# 3. Iniciar base de datos
npm run docker:up

# 4. Iniciar todos los servicios
npm run dev

# 5. Ver logs en tiempo real
npm run pm2:logs

# 6. Cuando termines de trabajar
npm run dev:stop
```

---

¡Feliz desarrollo! 🎉 