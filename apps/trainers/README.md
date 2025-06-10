# 🏋️ Módulo Trainers

## 📋 Descripción

El módulo **Trainers** gestiona los perfiles de entrenadores personales dentro del sistema de gestión de entrenamiento. Permite a los usuarios registrarse como entrenadores, definir sus especialidades, idiomas, disponibilidad y precios.

## 🏗️ Arquitectura

Este módulo sigue los principios de **Domain-Driven Design (DDD)** y **Clean Architecture**:

```
trainers/
├── src/
│   ├── domain/              # Capa de dominio
│   │   ├── entities/        # Entidades de negocio
│   │   ├── value-objects/   # Objetos de valor
│   │   └── repositories/    # Interfaces de repositorios
│   ├── application/         # Casos de uso
│   │   └── use-cases/       # Lógica de aplicación
│   ├── infrastructure/      # Adaptadores externos
│   │   └── repositories/    # Implementaciones de repositorios
│   └── presentation/        # Capa de presentación
│       ├── controllers/     # Controladores REST
│       └── dtos/           # DTOs de entrada/salida
```

## 🎯 Casos de Uso

### 1. Registrarse como entrenador
- **Endpoint**: `POST /trainers`
- **Descripción**: Permite a un usuario crear su perfil como entrenador personal
- **Validaciones**:
  - El usuario no debe tener ya un perfil de entrenador
  - Al menos un idioma es requerido
  - Especialidades válidas según catálogo predefinido

### 2. Buscar entrenadores por filtros
- **Endpoint**: `GET /trainers`
- **Descripción**: Búsqueda avanzada con múltiples filtros
- **Filtros disponibles**:
  - Texto libre (bio, nombre)
  - Especialidades
  - Idiomas
  - Rango de precios
  - Calificación mínima
  - Disponibilidad
  - Geolocalización

### 3. Ver perfil de un entrenador
- **Endpoint**: `GET /trainers/:id`
- **Descripción**: Obtiene información completa de un entrenador específico

### 4. Actualizar perfil de entrenador
- **Endpoint**: `PUT /trainers/:id`
- **Descripción**: Permite modificar datos profesionales
- **Autorización**: Solo el propietario del perfil

### 5. Eliminar perfil de entrenador
- **Endpoint**: `DELETE /trainers/:id`
- **Descripción**: Elimina el perfil de entrenador
- **Autorización**: Solo el propietario del perfil

## 🏛️ Entidades de Dominio

### Trainer
Entidad principal que representa a un entrenador personal.

**Atributos:**
- `id`: UUID único
- `userId`: Referencia al usuario
- `bio`: Descripción profesional
- `specialties`: Lista de especialidades
- `languages`: Lista de idiomas
- `rating`: Calificación promedio
- `pricePerSession`: Precio sugerido por sesión
- `availableTimes`: Disponibilidad horaria
- `isActive`: Estado del perfil
- `metadata`: Datos adicionales

**Reglas de negocio:**
- Al menos un idioma es obligatorio
- Máximo 10 especialidades
- Bio entre 10 y 1000 caracteres
- Precio debe ser mayor a cero

## 🎨 Value Objects

### TrainerSpecialty
Representa las especialidades de un entrenador.

**Especialidades válidas:**
- `STRENGTH_TRAINING` - Entrenamiento de fuerza
- `CARDIO` - Ejercicio cardiovascular
- `YOGA` - Yoga
- `PILATES` - Pilates
- `HIIT` - Entrenamiento de alta intensidad
- `FUNCTIONAL_TRAINING` - Entrenamiento funcional
- `CROSSFIT` - CrossFit
- `POWERLIFTING` - Powerlifting
- `BODYBUILDING` - Culturismo
- `MARTIAL_ARTS` - Artes marciales
- Y más...

### TrainerLanguage
Idiomas que habla el entrenador (códigos ISO 639-1).

**Ejemplos:**
- `ES` - Español
- `EN` - English
- `FR` - Français
- `DE` - Deutsch

### Money
Representa cantidades monetarias con validación de moneda.

**Características:**
- Soporte para múltiples monedas
- Validación de decimales (máximo 2)
- Operaciones aritméticas seguras

### TrainerAvailability
Gestiona la disponibilidad semanal del entrenador.

**Estructura:**
```typescript
{
  MONDAY: {
    isAvailable: true,
    timeSlots: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "18:00" }
    ]
  },
  // ... otros días
}
```

### TrainerRating
Calificación del entrenador con categorización automática.

**Categorías:**
- `EXCELLENT` (4.5-5.0)
- `GOOD` (4.0-4.4)
- `AVERAGE` (3.0-3.9)
- `POOR` (<3.0)

## 🔌 API Endpoints

### Crear Entrenador
```http
POST /trainers
Content-Type: application/json

{
  "userId": "user-uuid",
  "bio": "Entrenador personal con 5 años de experiencia...",
  "specialties": ["YOGA", "PILATES"],
  "languages": ["ES", "EN"],
  "pricePerSession": {
    "amount": 50.00,
    "currency": "EUR"
  },
  "availableTimes": {
    "MONDAY": {
      "isAvailable": true,
      "timeSlots": [{"start": "09:00", "end": "17:00"}]
    }
  }
}
```

### Buscar Entrenadores
```http
GET /trainers?specialties=YOGA,PILATES&languages=ES&minPrice=30&maxPrice=80&page=1&limit=20
```

### Obtener Entrenador
```http
GET /trainers/trainer-uuid
```

### Actualizar Entrenador
```http
PUT /trainers/trainer-uuid
Content-Type: application/json

{
  "bio": "Nueva descripción profesional...",
  "pricePerSession": {
    "amount": 60.00,
    "currency": "EUR"
  }
}
```

### Eliminar Entrenador
```http
DELETE /trainers/trainer-uuid
```

### Obtener Especialidades Disponibles
```http
GET /trainers/specialties/list
```

### Obtener Idiomas Disponibles
```http
GET /trainers/languages/list
```

## 🧪 Testing

### Tests Unitarios
```bash
# Ejecutar tests del módulo trainers
npm run test:trainers

# Tests específicos
npm test -- --testPathPattern=trainers
```

### Cobertura de Tests
- **Entidades de dominio**: 100%
- **Value Objects**: 100%
- **Casos de uso**: 95%
- **Controladores**: 90%

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar base de datos
```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

### 3. Ejecutar el módulo
```bash
# Desarrollo
npm run start:trainers

# Producción
npm run start:trainers:prod
```

## 📊 Modelo de Base de Datos

```sql
CREATE TABLE trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specialties JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  rating DECIMAL(2,1),
  price_per_session DECIMAL(10,2),
  available_times JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_trainers_user_id ON trainers(user_id);
CREATE INDEX idx_trainers_rating ON trainers(rating);
CREATE INDEX idx_trainers_price ON trainers(price_per_session);
```

## 🔒 Seguridad y Autorización

### Reglas de Autorización
- **Crear perfil**: Usuario autenticado sin perfil de entrenador existente
- **Ver perfil**: Público (cualquier usuario)
- **Actualizar perfil**: Solo el propietario del perfil
- **Eliminar perfil**: Solo el propietario del perfil
- **Buscar entrenadores**: Público

### Validaciones de Entrada
- Sanitización de datos de entrada
- Validación de tipos y formatos
- Límites de longitud en campos de texto
- Validación de monedas y precios

## 🔄 Patrones de Diseño Implementados

### 1. Repository Pattern
Abstrae el acceso a datos mediante interfaces.

### 2. Command Pattern
Los casos de uso reciben comandos con toda la información necesaria.

### 3. Factory Pattern
Creación de entidades mediante métodos factory.

### 4. Value Object Pattern
Encapsulación de lógica de validación en objetos inmutables.

### 5. Dependency Injection
Inversión de dependencias mediante tokens de inyección.

## 📈 Métricas y Monitoreo

### Métricas de Negocio
- Número de entrenadores activos
- Distribución por especialidades
- Precios promedio por especialidad
- Calificaciones promedio

### Métricas Técnicas
- Tiempo de respuesta de endpoints
- Tasa de errores
- Uso de memoria
- Consultas a base de datos

## 🔮 Roadmap Futuro

### Funcionalidades Planificadas
- [ ] Sistema de reseñas y calificaciones
- [ ] Integración con sistema de pagos
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Análisis de disponibilidad inteligente
- [ ] Recomendaciones basadas en IA
- [ ] Integración con calendarios externos

### Mejoras Técnicas
- [ ] Cache distribuido con Redis
- [ ] Búsqueda con Elasticsearch
- [ ] Event Sourcing para auditoría
- [ ] Microservicios independientes
- [ ] GraphQL API

## 🤝 Contribución

### Estándares de Código
- Seguir principios SOLID
- Cobertura de tests > 90%
- Documentación de APIs con Swagger
- Validación de tipos con TypeScript

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear rama feature
3. Implementar funcionalidad
4. Escribir tests
5. Crear Pull Request
6. Code Review
7. Merge a main

## 📞 Soporte

Para dudas o problemas:
- **Email**: dev@trainingmanagement.com
- **Slack**: #trainers-module
- **Documentación**: [Wiki del proyecto]

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenedor**: Equipo de Desarrollo TMS 