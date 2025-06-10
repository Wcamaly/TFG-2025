import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setSwagger = (app: INestApplication, serviceName?: string) => {
  // Detectar el servicio basado en el puerto o variable de entorno
  const port = process.env.PORT || process.env.PORT_AUTH || process.env.PORT_USERS || 
               process.env.PORT_TRAININGS || process.env.PORT_GYMS || 
               process.env.PORT_BOOKINGS || process.env.PORT_PAYMENTS;
  
  const serviceInfo = getServiceInfo(serviceName, port);
  
  const config = new DocumentBuilder()
    .setTitle(`TFG - ${serviceInfo.title}`)
    .setDescription(`
      ${serviceInfo.description}
      
      🔗 **Enlaces a otros servicios:**
      - [Auth Service](http://localhost:3001/api) - Autenticación y autorización
      - [Users Service](http://localhost:3002/api) - Gestión de usuarios
      - [Trainers Service](http://localhost:3003/api) - Gestión de entrenadores
      - [Gyms Service](http://localhost:3004/api) - Gestión de gimnasios
      - [Bookings Service](http://localhost:3005/api) - Gestión de reservas
      - [Payments Service](http://localhost:3006/api) - Gestión de pagos
      
      📧 **Contacto:** developer@trainingSystem.com
    `)
    .setVersion("1.0")
    .addTag(serviceInfo.mainTag, serviceInfo.tagDescription)
    .addBearerAuth()
    .addServer(`http://localhost:${port}`, 'Development')
    .addServer('https://api.yourdomain.com', 'Production')
    .setContact('Training System Team', 'https://trainingSystem.com', 'developer@trainingSystem.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configuración de seguridad mejorada
  document.components.securitySchemes = {
    bearer: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Introduce el token JWT en el formato: Bearer {token}"
    },
  };

  document.security = [{ bearer: [] }];
  
  // Setup Swagger con configuración mejorada
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: `${serviceInfo.title} - API Documentation`,
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1890ff; }
      .swagger-ui .info .description { margin: 20px 0; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info h1 { font-size: 2.5em; }
    `,
    customJs: '/custom-swagger.js',
  });
};

function getServiceInfo(serviceName?: string, port?: string) {
  // Mapeo de puertos a servicios
  const portToService: Record<string, string> = {
    '3001': 'auth',
    '3002': 'users', 
    '3003': 'trainers',
    '3004': 'gyms',
    '3005': 'bookings',
    '3006': 'payments',
  };
  
  const detectedService = serviceName || portToService[port || ''] || 'api';
  
  const serviceConfig: Record<string, any> = {
    auth: {
      title: 'Authentication & Authorization Service',
      description: '🔐 Servicio de autenticación, autorización y gestión de sesiones. Maneja login, registro, tokens JWT y control de acceso.',
      mainTag: 'auth',
      tagDescription: 'Endpoints de autenticación y autorización'
    },
    users: {
      title: 'Users Management Service', 
      description: '👥 Servicio de gestión de usuarios. CRUD de perfiles, preferencias y información personal.',
      mainTag: 'users',
      tagDescription: 'Endpoints de gestión de usuarios'
    },
    trainers: {
      title: 'Trainers Management Service',
      description: '🏋️ Servicio de gestión de entrenadores. Perfiles, especialidades, disponibilidad y búsquedas.',
      mainTag: 'trainers', 
      tagDescription: 'Endpoints de gestión de entrenadores'
    },
    gyms: {
      title: 'Gyms Management Service',
      description: '🏢 Servicio de gestión de gimnasios. Ubicaciones, horarios, instalaciones y servicios.',
      mainTag: 'gyms',
      tagDescription: 'Endpoints de gestión de gimnasios'
    },
    bookings: {
      title: 'Bookings Management Service',
      description: '📅 Servicio de gestión de reservas. Citas, horarios, confirmaciones y cancelaciones.',
      mainTag: 'bookings',
      tagDescription: 'Endpoints de gestión de reservas'
    },
    payments: {
      title: 'Payments Management Service',
      description: '💳 Servicio de gestión de pagos. Transacciones, métodos de pago y facturación.',
      mainTag: 'payments',
      tagDescription: 'Endpoints de gestión de pagos'
    },
    api: {
      title: 'Training Management System API',
      description: '🚀 Sistema completo de gestión de entrenamiento con múltiples servicios integrados.',
      mainTag: 'api',
      tagDescription: 'Endpoints generales del sistema'
    }
  };
  
  return serviceConfig[detectedService] || serviceConfig.api;
}
