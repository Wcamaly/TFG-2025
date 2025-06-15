# Módulo de Pagos

## Descripción
Módulo encargado de la gestión de pagos, suscripciones y transacciones del sistema.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Payment, Subscription, Transaction
  - Value Objects: Money, PaymentMethod, SubscriptionPlan
  - Agregados: PaymentAggregate
- **Application**: 
  - Casos de uso para gestión de pagos
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con pasarelas de pago

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de pagos
- **Factory Pattern**: Para creación de transacciones
- **Strategy Pattern**: Para diferentes métodos de pago
- **Observer Pattern**: Para eventos de pago

## Funcionalidades Principales
- Procesamiento de pagos
- Gestión de suscripciones
- Facturación automática
- Reembolsos y cancelaciones
- Historial de transacciones
- Reportes financieros
- Integración con pasarelas de pago

## Endpoints
- `POST /payments`: Procesar pago
- `GET /payments/:id`: Obtener pago por ID
- `POST /payments/refund`: Procesar reembolso
- `GET /payments/user/:userId`: Pagos de un usuario
- `POST /subscriptions`: Crear suscripción
- `PUT /subscriptions/:id`: Actualizar suscripción
- `DELETE /subscriptions/:id`: Cancelar suscripción
- `GET /transactions`: Listar transacciones

## Modelo de Datos
```typescript
interface Payment {
  id: string;
  userId: string;
  amount: Money;
  status: PaymentStatus;
  method: PaymentMethod;
  metadata: PaymentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
  paymentMethod: PaymentMethod;
}

interface Transaction {
  id: string;
  paymentId: string;
  type: TransactionType;
  amount: Money;
  status: TransactionStatus;
  metadata: TransactionMetadata;
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- Stripe para procesamiento de pagos

## Testing
```bash
# Tests unitarios
npm run test payments

# Tests e2e
npm run test:e2e payments
```

## Eventos
- `PaymentProcessed`: Cuando se procesa un pago
- `PaymentFailed`: Cuando falla un pago
- `SubscriptionCreated`: Cuando se crea una suscripción
- `SubscriptionCancelled`: Cuando se cancela una suscripción
- `RefundProcessed`: Cuando se procesa un reembolso 