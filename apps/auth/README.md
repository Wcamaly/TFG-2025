# Módulo de Autenticación

## Descripción
Módulo encargado de la gestión de autenticación, autorización y seguridad del sistema, incluyendo registro, login, gestión de tokens y recuperación de contraseña.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Auth, Session, Token
  - Value Objects: Password, JWT, RefreshToken
  - Agregados: AuthAggregate
- **Application**: 
  - Casos de uso para autenticación
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de autenticación
- **Factory Pattern**: Para creación de tokens
- **Strategy Pattern**: Para diferentes métodos de autenticación
- **Observer Pattern**: Para eventos de autenticación

## Funcionalidades Principales
- Registro de usuarios
- Login y autenticación
- Gestión de sesiones
- Renovación de tokens
- Recuperación de contraseña
- Validación de tokens
- Autorización basada en roles
- Gestión de permisos

## Endpoints
- `POST /auth/register`: Registro de nuevos usuarios
- `POST /auth/login`: Autenticación de usuarios
- `POST /auth/refresh`: Renovación de tokens
- `POST /auth/logout`: Cierre de sesión
- `POST /auth/forgot-password`: Solicitud de recuperación
- `POST /auth/reset-password`: Restablecimiento de contraseña
- `POST /auth/verify-email`: Verificación de email
- `GET /auth/me`: Obtener información del usuario autenticado

## Modelo de Datos
```typescript
interface Auth {
  id: string;
  userId: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: JWT;
  refreshToken: RefreshToken;
  expiresAt: Date;
  deviceInfo: DeviceInfo;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
```

## Dependencias
- JWT para manejo de tokens
- Bcrypt para encriptación
- TypeORM para persistencia
- Class Validator para validación
- Nodemailer para emails

## Configuración
```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
```

## Testing
```bash
# Tests unitarios
npm run test auth

# Tests e2e
npm run test:e2e auth
```

## Eventos
- `UserRegistered`: Cuando se registra un nuevo usuario
- `UserLoggedIn`: Cuando un usuario inicia sesión
- `UserLoggedOut`: Cuando un usuario cierra sesión
- `PasswordReset`: Cuando se restablece una contraseña
- `EmailVerified`: Cuando se verifica un email 