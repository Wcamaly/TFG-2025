# Módulo de Reservas

## Descripción
Módulo encargado de la gestión de reservas de clases, entrenamientos y uso de instalaciones.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Booking, Session, Facility
  - Value Objects: TimeSlot, Status, PaymentInfo
  - Agregados: BookingAggregate
- **Application**: 
  - Casos de uso para gestión de reservas
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de reservas
- **Factory Pattern**: Para creación de reservas
- **State Pattern**: Para manejo de estados de reserva
- **Observer Pattern**: Para eventos de reserva

## Funcionalidades Principales
- Gestión de reservas de clases
- Reserva de instalaciones
- Control de disponibilidad
- Sistema de cancelaciones
- Notificaciones automáticas
- Historial de reservas
- Estadísticas de ocupación

## Endpoints
- `GET /bookings`: Listar reservas
- `GET /bookings/:id`: Obtener reserva por ID
- `POST /bookings`: Crear reserva
- `PUT /bookings/:id`: Actualizar reserva
- `DELETE /bookings/:id`: Cancelar reserva
- `GET /bookings/availability`: Verificar disponibilidad
- `GET /bookings/user/:userId`: Reservas de un usuario
- `GET /bookings/trainer/:trainerId`: Reservas de un entrenador

## Modelo de Datos
```typescript
interface Booking {
  id: string;
  userId: string;
  trainerId?: string;
  facilityId?: string;
  type: BookingType;
  status: BookingStatus;
  timeSlot: TimeSlot;
  paymentInfo: PaymentInfo;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  duration: number;
}

interface PaymentInfo {
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- Node Schedule para programación

## Testing
```bash
# Tests unitarios
npm run test bookings

# Tests e2e
npm run test:e2e bookings
```

## Eventos
- `BookingCreated`: Cuando se crea una nueva reserva
- `BookingUpdated`: Cuando se actualiza una reserva
- `BookingCancelled`: Cuando se cancela una reserva
- `BookingCompleted`: Cuando se completa una reserva
- `AvailabilityChanged`: Cuando cambia la disponibilidad 