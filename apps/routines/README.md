# Módulo de Rutinas

## Descripción
Módulo encargado de la gestión de rutinas de entrenamiento, ejercicios y seguimiento de progreso.

## Arquitectura

### Capas
- **Domain**: 
  - Entidades: Routine, Exercise, Workout, Progress
  - Value Objects: ExerciseType, Difficulty, Metrics
  - Agregados: RoutineAggregate
- **Application**: 
  - Casos de uso para gestión de rutinas
  - Servicios de aplicación
- **Infrastructure**: 
  - Repositorios
  - Adaptadores de persistencia
  - Integración con servicios externos

### Patrones de Diseño
- **Repository Pattern**: Para acceso a datos de rutinas
- **Factory Pattern**: Para creación de ejercicios
- **Template Method**: Para definición de rutinas
- **Observer Pattern**: Para eventos de progreso

## Funcionalidades Principales
- Creación y gestión de rutinas
- Catálogo de ejercicios
- Seguimiento de progreso
- Estadísticas de rendimiento
- Personalización de rutinas
- Recomendaciones basadas en objetivos
- Exportación de rutinas

## Endpoints
- `GET /routines`: Listar rutinas
- `GET /routines/:id`: Obtener rutina por ID
- `POST /routines`: Crear rutina
- `PUT /routines/:id`: Actualizar rutina
- `DELETE /routines/:id`: Eliminar rutina
- `GET /exercises`: Listar ejercicios
- `POST /exercises`: Crear ejercicio
- `GET /progress`: Obtener progreso
- `POST /progress`: Registrar progreso

## Modelo de Datos
```typescript
interface Routine {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  exercises: Exercise[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  metrics: ExerciseMetrics;
}

interface Progress {
  id: string;
  userId: string;
  routineId: string;
  date: Date;
  metrics: ProgressMetrics;
  notes?: string;
}
```

## Dependencias
- TypeORM para persistencia
- Class Validator para validación
- Event Emitter para eventos
- Chart.js para visualización

## Testing
```bash
# Tests unitarios
npm run test routines

# Tests e2e
npm run test:e2e routines
```

## Eventos
- `RoutineCreated`: Cuando se crea una nueva rutina
- `RoutineUpdated`: Cuando se actualiza una rutina
- `ExerciseAdded`: Cuando se agrega un ejercicio
- `ProgressRecorded`: Cuando se registra progreso
- `GoalAchieved`: Cuando se alcanza un objetivo 