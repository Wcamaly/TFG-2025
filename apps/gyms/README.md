# Módulo Gyms

Este módulo implementa la gestión de gimnasios siguiendo principios de **Domain-Driven Design (DDD)** y **Arquitectura Limpia**.

## 🏗️ Arquitectura

El módulo está organizado en las siguientes capas:

### Domain Layer (`/domain`)
- **Entities**: `Gym` - Entidad principal que representa un gimnasio
- **Value Objects**: `GymLocationVO` - Objeto de valor para coordenadas geográficas
- **Repositories**: `GymRepository` - Interfaz del repositorio (puerto)

### Application Layer (`/application`)
- **Use Cases**: Casos de uso que implementan la lógica de negocio
  - `CreateGymUseCase` - Crear gimnasio
  - `UpdateGymUseCase` - Actualizar gimnasio
  - `FindGymsByLocationUseCase` - Buscar gimnasios por ubicación
  - `GetGymDetailsUseCase` - Obtener detalles de un gimnasio
  - `DeleteGymUseCase` - Eliminar gimnasio

### Infrastructure Layer (`/infrastructure`)
- **Repositories**: `PrismaGymRepository` - Implementación del repositorio usando Prisma

### Presentation Layer (`/presentation`)
- **Controllers**: `GymsController` - Controlador REST API
- **DTOs**: Objetos de transferencia de datos para validación y documentación

## 🚀 API Endpoints

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/gyms` | Crear gimnasio | ✅ |
| GET | `/gyms` | Listar gimnasios cercanos | ❌ |
| GET | `/gyms/:id` | Ver detalles de un gimnasio | ❌ |
| PUT | `/gyms/:id` | Actualizar un gimnasio | ✅ |
| DELETE | `/gyms/:id` | Eliminar gimnasio | ✅ |

## 📊 Modelo de Datos

### Entidad Gym
```typescript
{
  id: string;              // UUID único
  name: string;            // Nombre del gimnasio
  description: string;     // Descripción
  address: string;         // Dirección física
  location: {              // Coordenadas geográficas
    latitude: number;
    longitude: number;
  };
  phone: string;           // Teléfono de contacto
  email: string;           // Email de contacto
  openingHours: {          // Horarios de atención
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    // ... resto de días
  };
  ownerId: string;         // ID del propietario
  createdAt: Date;         // Fecha de creación
  updatedAt: Date;         // Fecha de actualización
  isActive: boolean;       // Estado activo/inactivo
}
```

## 🔍 Funcionalidades Principales

### 1. Crear Gimnasio
- Valida que no exista otro gimnasio con el mismo nombre en un radio de 1km
- Solo usuarios autenticados pueden crear gimnasios
- Genera ID único automáticamente

### 2. Buscar Gimnasios por Ubicación
- Búsqueda por coordenadas geográficas
- Filtros por distancia máxima (default: 10km)
- Filtros por nombre
- Paginación opcional
- Resultados ordenados por distancia

### 3. Gestión de Propietario
- Solo el propietario puede actualizar/eliminar su gimnasio
- Validación de autorización en todas las operaciones

### 4. Eliminación Suave
- Los gimnasios se marcan como inactivos en lugar de eliminarse físicamente
- Preserva integridad referencial

## 🧪 Testing

El módulo incluye pruebas unitarias completas:

```bash
# Ejecutar pruebas del módulo gyms
npm test -- --testPathPattern=gyms

# Ejecutar con coverage
npm test -- --testPathPattern=gyms --coverage
```

### Cobertura de Pruebas
- **Entidades**: Pruebas de comportamiento y inmutabilidad
- **Casos de Uso**: Pruebas de lógica de negocio y manejo de errores
- **Validaciones**: Pruebas de reglas de negocio

## 🛠️ Tecnologías Utilizadas

- **NestJS**: Framework backend
- **Prisma**: ORM para base de datos
- **PostgreSQL**: Base de datos con extensiones geoespaciales
- **class-validator**: Validación de DTOs
- **Swagger**: Documentación automática de API
- **Jest**: Framework de testing

## 📝 Principios Aplicados

### SOLID
- **S**: Cada clase tiene una responsabilidad única
- **O**: Abierto para extensión, cerrado para modificación
- **L**: Las implementaciones son intercambiables
- **I**: Interfaces segregadas por funcionalidad
- **D**: Dependencias invertidas usando inyección

### DDD
- **Entidades**: Objetos con identidad única
- **Value Objects**: Objetos inmutables sin identidad
- **Repositorios**: Abstracción de persistencia
- **Casos de Uso**: Lógica de aplicación

### Arquitectura Limpia
- **Separación de capas**: Domain, Application, Infrastructure, Presentation
- **Inversión de dependencias**: Las capas externas dependen de las internas
- **Testabilidad**: Cada capa es testeable independientemente

## 🚀 Próximas Mejoras

- [ ] Implementar cache para búsquedas geográficas
- [ ] Agregar métricas y logging
- [ ] Implementar eventos de dominio
- [ ] Agregar validaciones de horarios de apertura
- [ ] Implementar sistema de ratings y reviews 