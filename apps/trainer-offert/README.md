# Módulo de Ofertas de Entrenadores

## Descripción
Módulo encargado de la gestión de ofertas y servicios ofrecidos por los entrenadores, incluyendo precios, paquetes y disponibilidad.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Offer, ServicePackage, Pricing
  - Value Objects: Price, Duration, Availability
  - Agregados: OfferAggregate
- **Application**: 
  - Casos de uso para gestión de ofertas
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de ofertas
- **Factory Pattern**: Para creación de paquetes
- **Strategy Pattern**: Para diferentes tipos de ofertas
- **Observer Pattern**: Para eventos de oferta

## Funcionalidades Principales
- Gestión de ofertas de entrenamiento
- Creación de paquetes de servicios
- Configuración de precios y descuentos
- Gestión de disponibilidad
- Estadísticas de ofertas
- Sistema de promociones
- Recomendaciones personalizadas

## Endpoints
- `GET /offers`: Listar ofertas
- `GET /offers/:id`: Obtener oferta por ID
- `POST /offers`: Crear oferta
- `PUT /offers/:id`: Actualizar oferta
- `DELETE /offers/:id`: Eliminar oferta
- `GET /packages`: Listar paquetes
- `POST /packages`: Crear paquete
- `GET /pricing`: Obtener precios
- `PUT /pricing`: Actualizar precios

## Modelo de Datos
```typescript
interface Offer {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  packages: ServicePackage[];
  availability: Availability;
  pricing: Pricing;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  duration: number;
  sessions: number;
  price: Price;
  features: string[];
}

interface Pricing {
  basePrice: Price;
  discounts: Discount[];
  specialOffers: SpecialOffer[];
  currency: string;
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- Moment.js para manejo de fechas

## Testing
```bash
# Tests unitarios
npm run test trainer-offert

# Tests e2e
npm run test:e2e trainer-offert
```

## Eventos
- `OfferCreated`: Cuando se crea una nueva oferta
- `OfferUpdated`: Cuando se actualiza una oferta
- `PackageAdded`: Cuando se agrega un paquete
- `PricingUpdated`: Cuando se actualizan los precios
- `PromotionActivated`: Cuando se activa una promoción 