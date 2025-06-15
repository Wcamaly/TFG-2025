import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroservicesService } from '@infra/microservices/microservices.service';

export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
  description: string;
  tag: string;
}

interface Service {
  name: string;
  url: string;
  prefix: string;
}

interface ServiceHealth {
  service: Service;
  status: 'online' | 'offline';
  responseTime: number;
}

@Injectable()
export class SwaggerMergerService {
  private readonly logger = new Logger(SwaggerMergerService.name);
  private readonly services: ServiceConfig[];

  constructor(
    private readonly configService: ConfigService,
    private readonly microservicesService: MicroservicesService
  ) {
    this.services = [
      {
        name: 'Auth Service',
        url: this.configService.get<string>('AUTH_SERVICE_URL', 'http://localhost:3002'),
        prefix: '/auth',
        description: '🔐 Autenticación y autorización',
        tag: 'auth'
      },
      {
        name: 'Users Service', 
        url: this.configService.get<string>('USERS_SERVICE_URL', 'http://localhost:3001'),
        prefix: '/users',
        description: '👥 Gestión de usuarios',
        tag: 'users'
      },
      {
        name: 'Trainers Service',
        url: this.configService.get<string>('TRAINERS_SERVICE_URL', 'http://localhost:3006'), 
        prefix: '/trainers',
        description: '🏋️ Gestión de entrenadores',
        tag: 'trainers'
      },
      {
        name: 'Gyms Service',
        url: this.configService.get<string>('GYMS_SERVICE_URL', 'http://localhost:3003'),
        prefix: '/gyms', 
        description: '🏢 Gestión de gimnasios',
        tag: 'gyms'
      },
      {
        name: 'Bookings Service',
        url: this.configService.get<string>('BOOKINGS_SERVICE_URL', 'http://localhost:3004'),
        prefix: '/bookings',
        description: '📅 Gestión de reservas', 
        tag: 'bookings'
      },
      {
        name: 'Payments Service',
        url: this.configService.get<string>('PAYMENTS_SERVICE_URL', 'http://localhost:3005'),
        prefix: '/payments',
        description: '💳 Gestión de pagos',
        tag: 'payments'
      },
      {
        name: 'Trainer Offert Service',
        url: this.configService.get<string>('TRAINER_OFFERT_SERVICE_URL', 'http://localhost:3007'),
        prefix: '/trainer-offert',
        description: '💳 Gestión de ofertas de entrenadores',
        tag: 'trainer-offert'
      }
    ];
  }

  async getMergedSwaggerDocument(): Promise<any> {
    const baseDocument = this.createBaseDocument();
    const serviceDocuments = await this.fetchAllServiceDocuments();
    return this.mergeDocuments(baseDocument, serviceDocuments);
  }

  private createBaseDocument(): any {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Training Management System - API Gateway',
        description: `
🚀 **Sistema de Gestión de Entrenamiento - API Unificada**

Esta API Gateway unifica todos los microservicios del sistema proporcionando:
- **Punto de entrada único** para todas las operaciones
- **Documentación centralizada** de todos los servicios  
- **Autenticación y autorización** unificada
- **Enrutamiento inteligente** a los microservicios correspondientes

### 📋 **Servicios Disponibles:**
${this.services.map(s => `- **${s.description}**: \`${s.prefix}/*\``).join('\n')}

### 🔗 **Enlaces Directos:**
${this.services.map(s => `- [${s.name}](${s.url}/api) - ${s.description}`).join('\n')}

### 🛡️ **Autenticación:**
Todos los endpoints requieren autenticación JWT Bearer token.

### 📧 **Soporte:**
- Email: developer@trainingsystem.com
- Documentación: [Guía del desarrollador](https://docs.trainingsystem.com)
        `,
        version: '1.0.0',
        contact: {
          name: 'Training System Team',
          url: 'https://trainingsystem.com',
          email: 'developer@trainingsystem.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://localhost:${this.configService.get('API_GATEWAY_PORT', 3000)}`,
          description: 'Development Server'
        },
        {
          url: 'https://api.trainingsystem.com',
          description: 'Production Server'
        }
      ],
      tags: this.services.map(service => ({
        name: service.tag,
        description: service.description,
        externalDocs: {
          description: `Documentación directa de ${service.name}`,
          url: `${service.url}/api`
        }
      })),
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Introduce el token JWT obtenido del endpoint de login'
          }
        },
        schemas: {}
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    };
  }

  private async fetchAllServiceDocuments(): Promise<Array<{service: ServiceConfig, document: any}>> {
    const results = [];
    
    for (const service of this.services) {
      try {
        const document = await this.fetchServiceSwagger(service);
        if (document) {
          results.push({ service, document });
          this.logger.log(`✅ Swagger obtenido de ${service.name}`);
        }
      } catch (error) {
        this.logger.warn(`⚠️ No se pudo obtener Swagger de ${service.name}: ${error instanceof Error ? error.message : String(error)}`);
        results.push({ 
          service, 
          document: this.createFallbackDocument(service) 
        });
      }
    }
    
    return results;
  }

  private async fetchServiceSwagger(service: ServiceConfig): Promise<any> {
    return this.microservicesService.httpRequest(service.name, {
      url: '/api-json',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  private createFallbackDocument(service: ServiceConfig): any {
    return {
      paths: {
        [`${service.prefix}/health`]: {
          get: {
            tags: [service.tag],
            summary: `Health Check - ${service.name}`,
            description: `Verifica el estado del ${service.name}`,
            responses: {
              '200': {
                description: 'Servicio disponible',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' },
                        service: { type: 'string', example: service.name }
                      }
                    }
                  }
                }
              },
              '503': {
                description: 'Servicio no disponible'
              }
            }
          }
        }
      },
      components: {
        schemas: {}
      }
    };
  }

  private mergeDocuments(baseDocument: any, serviceDocuments: Array<{service: ServiceConfig, document: any}>): any {
    const merged = { ...baseDocument };

    for (const { service, document } of serviceDocuments) {
      if (document.paths) {
        for (const [path, methods] of Object.entries(document.paths)) {
          const prefixedPath = `${service.prefix}${path}`;
          merged.paths[prefixedPath] = this.addServiceTagsToMethods(methods as any, service.tag);
        }
      }

      if (document.components?.schemas) {
        merged.components.schemas = {
          ...merged.components.schemas,
          ...this.prefixSchemas(document.components.schemas, service.tag)
        };
      }

      if (document.components?.responses) {
        merged.components.responses = {
          ...merged.components.responses,
          ...this.prefixResponses(document.components.responses, service.tag)
        };
      }
    }

    return merged;
  }

  private addServiceTagsToMethods(methods: any, serviceTag: string): any {
    const updatedMethods = { ...methods };
    
    for (const [method, operation] of Object.entries(methods)) {
      if (typeof operation === 'object' && operation !== null) {
        const op = operation as any;
        updatedMethods[method] = {
          ...op,
          tags: [serviceTag, ...(op.tags || [])].filter((tag: string, index: number, self: string[]) => self.indexOf(tag) === index)
        };
      }
    }
    
    return updatedMethods;
  }

  private prefixSchemas(schemas: any, prefix: string): any {
    const prefixed: any = {};
    
    for (const [name, schema] of Object.entries(schemas)) {
      prefixed[`${prefix}_${name}`] = schema;
    }
    
    return prefixed;
  }

  private prefixResponses(responses: any, prefix: string): any {
    const prefixed: any = {};
    
    for (const [name, response] of Object.entries(responses)) {
      prefixed[`${prefix}_${name}`] = response;
    }
    
    return prefixed;
  }

  getServicesList(): ServiceConfig[] {
    return [...this.services];
  }

  async getServiceHealth(): Promise<ServiceHealth[]> {
    const healthChecks = await Promise.all(
      this.services.map(async (service) => {
        const startTime = Date.now();
        try {
          const response = await this.microservicesService.httpRequest(service.name, {
            url: '/health',
            method: 'GET'
          });
          const endTime = Date.now();
          return {
            service: {
              name: service.name,
              url: service.url,
              prefix: service.prefix
            },
            status: response && typeof response === 'object' && 'status' in response ? response.status === 'ok' ? 'online' : 'offline' : 'offline',
            responseTime: endTime - startTime
          };
        } catch (error) {
          return {
            service: {
              name: service.name,
              url: service.url,
              prefix: service.prefix
            },
            status: 'offline',
            responseTime: Date.now() - startTime
          };
        }
      })
    );

    return healthChecks as ServiceHealth[];
  }

  async mergeSwaggerDocs(): Promise<any> {
    const swaggerDocs = await Promise.all(
      this.services.map(async (service) => {
        try {
          const data = await this.microservicesService.httpRequest(service.name, {
            url: '/api-json',
            method: 'GET'
          });
          const swaggerData = data as { paths: Record<string, any> };
          return {
            ...swaggerData,
            paths: Object.entries(swaggerData.paths).reduce<Record<string, any>>((acc, [path, methods]) => {
              acc[`${service.prefix}${path}`] = methods;
              return acc;
            }, {})
          };
        } catch (error) {
          this.logger.error(`Error fetching swagger docs from ${service.name}:`, error);
          return null;
        }
      })
    );

    const validDocs = swaggerDocs.filter(doc => doc !== null);

    return {
      openapi: '3.0.0',
      info: {
        title: 'API Gateway',
        version: '1.0.0',
        description: 'API Gateway for all microservices'
      },
      paths: validDocs.reduce((acc, doc) => ({
        ...acc,
        ...doc.paths
      }), {}),
      components: {
        schemas: validDocs.reduce((acc, doc: any) => ({
          ...acc,
          ...((doc as any).components?.schemas || {})
        }), {}),
        securitySchemes: validDocs.reduce((acc, doc: any) => ({
          ...acc,
          ...((doc as any).components?.securitySchemes || {})
        }), {})
      }
    };
  }
} 