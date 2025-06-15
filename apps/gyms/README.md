# Módulo de Gimnasios

## Descripción
Módulo encargado de la gestión de gimnasios, sus instalaciones, horarios y servicios.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Gym, Facility, Schedule, Service
  - Value Objects: Address, ContactInfo, OperatingHours
  - Agregados: GymAggregate
- **Application**: 
  - Casos de uso para gestión de gimnasios
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de gimnasios
- **Factory Pattern**: Para creación de instalaciones y servicios
- **Composite Pattern**: Para estructura de instalaciones
- **Observer Pattern**: Para eventos de gimnasio

## Funcionalidades Principales
- Gestión de gimnasios y sus datos
- Administración de instalaciones
- Control de horarios y disponibilidad
- Gestión de servicios y clases
- Sistema de membresías
- Estadísticas y reportes

## Endpoints
- `GET /gyms`: Listar gimnasios
- `GET /gyms/:id`: Obtener gimnasio por ID
- `POST /gyms`: Crear gimnasio
- `PUT /gyms/:id`: Actualizar gimnasio
- `DELETE /gyms/:id`: Eliminar gimnasio
- `GET /gyms/:id/facilities`: Listar instalaciones
- `POST /gyms/:id/facilities`: Agregar instalación
- `GET /gyms/:id/schedule`: Obtener horario
- `PUT /gyms/:id/schedule`: Actualizar horario

## Modelo de Datos
```typescript
interface Gym {
  id: string;
  name: string;
  address: Address;
  contactInfo: ContactInfo;
  facilities: Facility[];
  services: Service[];
  schedule: Schedule;
  membershipTypes: MembershipType[];
  createdAt: Date;
  updatedAt: Date;
}

interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  equipment: Equipment[];
  status: FacilityStatus;
}

interface Schedule {
  operatingHours: OperatingHours[];
  specialDates: SpecialDate[];
  maintenancePeriods: MaintenancePeriod[];
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- GeoLocation para ubicaciones

## Testing
```bash
# Tests unitarios
npm run test gyms

# Tests e2e
npm run test:e2e gyms
```

## Eventos
- `GymCreated`: Cuando se crea un nuevo gimnasio
- `GymUpdated`: Cuando se actualiza un gimnasio
- `FacilityAdded`: Cuando se agrega una instalación
- `ScheduleUpdated`: Cuando se actualiza el horario
- `MaintenanceScheduled`: Cuando se programa mantenimiento 