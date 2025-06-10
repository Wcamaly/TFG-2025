# Training Management System

## Estructura del Monorepo

```
monorepo-root/
│
├── apps/
│   └── api/ # Proyecto NestJS principal
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   └── modules/ # Módulos por contexto de dominio
│       └── Dockerfile
│
├── libs/
│   └── core/ # Entidades, interfaces, casos de uso
│   └── infra/ # Implementaciones técnicas (repositorios, adaptadores, etc.)
│
├── docker-compose.yml
├── .env
└── README.md
```

## Levantar el proyecto

1. Copia el archivo `.env.example` a `.env` y ajusta las variables si es necesario.
2. Ejecuta:

```bash
docker-compose up --build
```

Esto levantará la API en el puerto 3000 y PostgreSQL en el 5432.

## Módulos de ejemplo
- users (registro, login, perfil)
- gyms (gestión de gimnasios)
- trainers (gestión de entrenadores)
- bookings (reservas)
- payments (pagos)

## Arquitectura
- Hexagonal (puertos y adaptadores)
- DDD (Domain-Driven Design)
- TypeORM + PostgreSQL

---

Para más detalles, consulta la documentación de cada módulo en `apps/api/src/modules/`.

NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=training_system
