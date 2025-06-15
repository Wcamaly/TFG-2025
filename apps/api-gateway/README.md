# Módulo API Gateway

## Descripción
Módulo que actúa como punto de entrada único para todas las peticiones del sistema, manejando el enrutamiento, autenticación, autorización y transformación de datos.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Route, Service, Policy
  - Value Objects: Endpoint, Method, Header
  - Agregados: GatewayAggregate
- **Application**: 
  - Casos de uso para gestión de rutas
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de rutas
- **Factory Pattern**: Para creación de políticas
- **Proxy Pattern**: Para enrutamiento de peticiones
- **Chain of Responsibility**: Para middleware
- **Decorator Pattern**: Para transformación de respuestas

## Funcionalidades Principales
- Enrutamiento de peticiones
- Autenticación y autorización
- Rate limiting
- Caché
- Transformación de datos
- Logging y monitoreo
- Balanceo de carga
- Circuit breaker

## Endpoints
- `GET /health`: Estado del gateway
- `GET /metrics`: Métricas del sistema
- `GET /routes`: Listar rutas configuradas
- `POST /routes`: Configurar nueva ruta
- `PUT /routes/:id`: Actualizar ruta
- `DELETE /routes/:id`: Eliminar ruta
- `GET /services`: Listar servicios
- `POST /services`: Registrar servicio

## Modelo de Datos
```typescript
interface Route {
  id: string;
  path: string;
  method: HttpMethod;
  service: Service;
  policies: Policy[];
  cache: CacheConfig;
  rateLimit: RateLimitConfig;
  createdAt: Date;
  updatedAt: Date;
}

interface Service {
  id: string;
  name: string;
  url: string;
  health: HealthStatus;
  endpoints: Endpoint[];
  loadBalancer: LoadBalancerConfig;
}

interface Policy {
  id: string;
  type: PolicyType;
  config: PolicyConfig;
  priority: number;
}
```

## Dependencias
- NestJS para el framework
- Redis para caché
- Prometheus para métricas
- Winston para logging
- JWT para autenticación

## Testing
```bash
# Tests unitarios
npm run test api-gateway

# Tests e2e
npm run test:e2e api-gateway
```

## Eventos
- `RouteCreated`: Cuando se crea una nueva ruta
- `RouteUpdated`: Cuando se actualiza una ruta
- `ServiceRegistered`: Cuando se registra un servicio
- `PolicyApplied`: Cuando se aplica una política
- `CircuitBreakerTriggered`: Cuando se activa el circuit breaker

## Configuración
```env
GATEWAY_PORT=3000
GATEWAY_HOST=localhost
REDIS_URL=redis://localhost:6379
PROMETHEUS_PORT=9090
LOG_LEVEL=info
``` 