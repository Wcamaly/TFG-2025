import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
  description: string;
  tag: string;
}

@Injectable()
export class SwaggerMergerService {
  private readonly logger = new Logger(SwaggerMergerService.name);
  
  private readonly services: ServiceConfig[] = [
    {
      name: 'Auth Service',
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
      prefix: '/auth',
      description: '🔐 Autenticación y autorización',
      tag: 'auth'
    },
    {
      name: 'Users Service', 
      url: process.env.USERS_SERVICE_URL || 'http://localhost:3001',
      prefix: '/users',
      description: '👥 Gestión de usuarios',
      tag: 'users'
    },
    {
      name: 'Trainers Service',
      url: process.env.TRAINERS_SERVICE_URL || 'http://localhost:3006', 
      prefix: '/trainers',
      description: '🏋️ Gestión de entrenadores',
      tag: 'trainers'
    },
    {
      name: 'Gyms Service',
      url: process.env.GYMS_SERVICE_URL || 'http://localhost:3003',
      prefix: '/gyms', 
      description: '🏢 Gestión de gimnasios',
      tag: 'gyms'
    },
    {
      name: 'Bookings Service',
      url: process.env.BOOKINGS_SERVICE_URL || 'http://localhost:3004',
      prefix: '/bookings',
      description: '📅 Gestión de reservas', 
      tag: 'bookings'
    },
    {
      name: 'Payments Service',
      url: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005',
      prefix: '/payments',
      description: '💳 Gestión de pagos',
      tag: 'payments'
    }
  ];

  constructor(private readonly configService: ConfigService) {}

  async getMergedSwaggerDocument(): Promise<any> {
    const baseDocument = this.createBaseDocument();
    
    // Obtener documentos de cada servicio
    const serviceDocuments = await this.fetchAllServiceDocuments();
    
    // Combinar todos los documentos
    const mergedDocument = this.mergeDocuments(baseDocument, serviceDocuments);
    
    return mergedDocument;
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
        // Agregar endpoints de fallback si el servicio no está disponible
        results.push({ 
          service, 
          document: this.createFallbackDocument(service) 
        });
      }
    }
    
    return results;
  }

  private async fetchServiceSwagger(service: ServiceConfig): Promise<any> {
    const url = `${service.url}/api-json`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
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
      // Merge paths con prefix
      if (document.paths) {
        for (const [path, methods] of Object.entries(document.paths)) {
          const prefixedPath = `${service.prefix}${path}`;
          merged.paths[prefixedPath] = this.addServiceTagsToMethods(methods as any, service.tag);
        }
      }

      // Merge components/schemas
      if (document.components?.schemas) {
        merged.components.schemas = {
          ...merged.components.schemas,
          ...this.prefixSchemas(document.components.schemas, service.tag)
        };
      }

      // Merge other components
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

  async getServiceHealth(): Promise<Array<{service: ServiceConfig, status: 'online' | 'offline', responseTime?: number}>> {
    const healthChecks = [];
    
    for (const service of this.services) {
      const startTime = Date.now();
      try {
        const response = await fetch(`${service.url}/api-json`);
        
        const responseTime = Date.now() - startTime;
        healthChecks.push({
          service,
          status: response.ok ? 'online' : 'offline' as const,
          responseTime
        });
      } catch (error) {
        healthChecks.push({
          service,
          status: 'offline' as const
        });
      }
    }
    
    return healthChecks;
  }
} 