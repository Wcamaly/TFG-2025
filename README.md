# Training Management System

Sistema de gestión de entrenamientos y gimnasios construido con NestJS, siguiendo principios de Domain-Driven Design y Arquitectura Hexagonal.

## 🚀 Características Principales

- Gestión completa de gimnasios y entrenadores
- Sistema de reservas y pagos
- Autenticación y autorización de usuarios
- API RESTful con documentación Swagger
- Base de datos PostgreSQL con TypeORM
- Monorepo con estructura modular

## 🏗️ Estructura del Monorepo

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

## 🛠️ Requisitos Previos

- Node.js >= 18.x
- Docker y Docker Compose
- PM2 (para desarrollo local)
- PostgreSQL (si se ejecuta sin Docker)

## 🔧 Configuración

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd training-management-system
```

2. Instala dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Ajusta las variables en el archivo `.env` según tu entorno.

## 🚀 Ejecución

### Usando Docker (Recomendado)

```bash
# Construir y levantar los contenedores
docker-compose up --build

# Para ejecutar en modo detached
docker-compose up -d

# Para detener los contenedores
docker-compose down
```

### Desarrollo Local con PM2

1. Instala PM2 globalmente:
```bash
npm install -g pm2
```

2. Inicia la aplicación:
```bash
# Desarrollo
pm2 start npm --name "training-api" -- run start:dev

# Producción
pm2 start npm --name "training-api" -- run start:prod
```

3. Monitoreo:
```bash
pm2 monit
pm2 logs training-api
```

## 📦 Módulos del Sistema

- **Users**: Gestión de usuarios, autenticación y perfiles
- **Gyms**: Administración de gimnasios y sus instalaciones
- **Trainers**: Gestión de entrenadores y sus especialidades
- **Bookings**: Sistema de reservas y calendario
- **Payments**: Procesamiento de pagos y suscripciones

## 🏛️ Arquitectura

### Principios Arquitectónicos

- **Arquitectura Hexagonal (Puertos y Adaptadores)**
  - Separación clara entre lógica de negocio y detalles técnicos
  - Adaptadores primarios (API REST, GraphQL)
  - Adaptadores secundarios (Base de datos, servicios externos)

- **Domain-Driven Design (DDD)**
  - Modelado del dominio basado en el negocio
  - Agregados, entidades y objetos de valor
  - Bounded Contexts para cada módulo

- **Clean Architecture**
  - Capas bien definidas (Domain, Application, Infrastructure)
  - Inversión de dependencias
  - Separación de responsabilidades

### Patrones de Diseño

- Repository Pattern para acceso a datos
- Factory Pattern para creación de objetos complejos
- Strategy Pattern para algoritmos intercambiables
- Observer Pattern para eventos del dominio
- CQRS para separación de operaciones de lectura/escritura

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📚 Documentación

- La documentación de la API está disponible en `/api/docs` cuando el servidor está en ejecución
- Documentación detallada de cada módulo en `apps/api/src/modules/`

## 🔐 Variables de Entorno

```env
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=training_system
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
