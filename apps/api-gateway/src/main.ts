import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';
import { SwaggerMergerService } from './swagger/swagger-merger.service';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Configuración CORS
  app.enableCors({
    allowedHeaders: 'Content-Type, Authorization',
  });

  const configService = app.get(ConfigService);
  const swaggerMerger = app.get(SwaggerMergerService);
  
  console.log('🔄 Generando documentación Swagger dinámica...');
  
  // Obtener documento Swagger dinámico combinado
  const mergedDocument = await swaggerMerger.getMergedSwaggerDocument();
  
  // Setup Swagger UI con documento dinámico
  SwaggerModule.setup('api', app, mergedDocument, {
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
    customSiteTitle: 'TFG Training System - API Gateway',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1890ff; }
      .swagger-ui .info .description { margin: 20px 0; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info h1 { font-size: 2.2em; margin-bottom: 10px; }
      .swagger-ui .opblock-tag { font-size: 1.2em; margin: 20px 0 10px 0; }
      .swagger-ui .opblock { margin-bottom: 10px; border-radius: 5px; }
    `,
  });

  // Endpoint para comprobar estado de servicios
  SwaggerModule.setup('api-json', app, mergedDocument);

  const port = configService.get('API_GATEWAY_PORT') || 3000;
  
  await app.listen(port);
  
  console.log(`\n🚀 API Gateway running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI available at: http://localhost:${port}/api`);
  console.log(`📄 Swagger JSON available at: http://localhost:${port}/api-json`);
  
  // Mostrar estado de servicios
  setTimeout(async () => {
    const healthStatus = await swaggerMerger.getServiceHealth();
    console.log('\n📊 Estado de microservicios:');
    healthStatus.forEach(({ service, status, responseTime }) => {
      const icon = status === 'online' ? '✅' : '❌';
      const time = responseTime ? ` (${responseTime}ms)` : '';
      console.log(`  ${icon} ${service.name}: ${status}${time}`);
    });
    console.log('');
  }, 2000);
}

bootstrap(); 