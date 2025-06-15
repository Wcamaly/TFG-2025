# Módulo de Usuarios

## Descripción
Módulo encargado de la gestión de usuarios y sus perfiles, incluyendo información personal, preferencias y configuraciones. Este módulo se centra en la gestión de datos de usuario, mientras que la autenticación y autorización se manejan en el módulo de auth.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: User, Profile, Preferences
  - Value Objects: Email, PhoneNumber, Address
  - Agregados: UserAggregate
- **Application**: 
  - Casos de uso para gestión de usuarios
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de usuarios
- **Factory Pattern**: Para creación de perfiles
- **Specification Pattern**: Para búsquedas complejas
- **Observer Pattern**: Para eventos de usuario

## Funcionalidades Principales
- Gestión de perfiles de usuario
- Administración de preferencias
- Gestión de información personal
- Historial de actividad
- Gestión de contactos
- Notificaciones de usuario

## Endpoints
- `GET /users`: Listar usuarios
- `GET /users/:id`: Obtener usuario por ID
- `PUT /users/:id`: Actualizar usuario
- `DELETE /users/:id`: Eliminar usuario
- `GET /users/:id/profile`: Obtener perfil
- `PUT /users/:id/profile`: Actualizar perfil
- `GET /users/:id/preferences`: Obtener preferencias
- `PUT /users/:id/preferences`: Actualizar preferencias

## Modelo de Datos
```typescript
interface User {
  id: string;
  email: string;
  profile: Profile;
  preferences: UserPreferences;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface Profile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: Address;
  avatar: string;
  bio?: string;
}

interface UserPreferences {
  language: string;
  notifications: NotificationSettings;
  theme: string;
  privacy: PrivacySettings;
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- File Upload para avatares

## Testing
```bash
# Tests unitarios
npm run test users

# Tests e2e
npm run test:e2e users
```

## Eventos
- `UserCreated`: Cuando se crea un nuevo usuario
- `UserUpdated`: Cuando se actualiza un usuario
- `UserDeleted`: Cuando se elimina un usuario
- `ProfileUpdated`: Cuando se actualiza un perfil
- `PreferencesUpdated`: Cuando se actualizan las preferencias 