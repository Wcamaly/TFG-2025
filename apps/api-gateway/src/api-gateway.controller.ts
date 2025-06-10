import { Controller, All, Req, Res, HttpException, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SwaggerMergerService } from './swagger/swagger-merger.service';

@Controller()
@ApiTags('gateway')
export class ApiGatewayController {
  private readonly services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    users: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
    trainers: process.env.TRAINERS_SERVICE_URL || 'http://localhost:3003',
    gyms: process.env.GYMS_SERVICE_URL || 'http://localhost:3004',
    bookings: process.env.BOOKINGS_SERVICE_URL || 'http://localhost:3005',
    payments: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3006',
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly swaggerMerger: SwaggerMergerService
  ) {}

  @Get('/health')
  @ApiOperation({ summary: 'Health check del API Gateway y microservicios' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de todos los servicios',
    schema: {
      type: 'object',
      properties: {
        gateway: { type: 'string', example: 'online' },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              status: { type: 'string', enum: ['online', 'offline'] },
              responseTime: { type: 'number', description: 'Tiempo de respuesta en ms' }
            }
          }
        }
      }
    }
  })
  async getHealth() {
    const serviceHealth = await this.swaggerMerger.getServiceHealth();
    
    return {
      gateway: 'online',
      timestamp: new Date().toISOString(),
      services: serviceHealth.map(({ service, status, responseTime }) => ({
        name: service.name,
        url: service.url,
        prefix: service.prefix,
        status,
        responseTime
      }))
    };
  }

  @All('/auth/*')
  @ApiTags('auth')
  @ApiOperation({ summary: 'Proxy to Authentication Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to auth service' })
  async proxyToAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.auth);
  }

  @All('/users/*')
  @ApiTags('users')
  @ApiOperation({ summary: 'Proxy to Users Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to users service' })
  async proxyToUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.users);
  }

  @All('/trainers/*')
  @ApiTags('trainers')
  @ApiOperation({ summary: 'Proxy to Trainers Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to trainers service' })
  async proxyToTrainers(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.trainers);
  }

  @All('/gyms/*')
  @ApiTags('gyms')
  @ApiOperation({ summary: 'Proxy to Gyms Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to gyms service' })
  async proxyToGyms(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.gyms);
  }

  @All('/bookings/*')
  @ApiTags('bookings')
  @ApiOperation({ summary: 'Proxy to Bookings Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to bookings service' })
  async proxyToBookings(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.bookings);
  }

  @All('/payments/*')
  @ApiTags('payments')
  @ApiOperation({ summary: 'Proxy to Payments Service' })
  @ApiResponse({ status: 200, description: 'Request forwarded to payments service' })
  async proxyToPayments(@Req() req: Request, @Res() res: Response) {
    return this.proxyRequest(req, res, this.services.payments);
  }

  private async proxyRequest(req: Request, res: Response, serviceUrl: string) {
    try {
      const path = req.url;
      const method = req.method;
      const headers = { ...req.headers };
      
      // Remove host header to avoid conflicts
      delete headers.host;
      
      const url = `${serviceUrl}${path}`;

      const response = await fetch(url, {
        method,
        headers: headers as any,
        body: ['GET', 'HEAD'].includes(method) ? undefined : JSON.stringify(req.body),
      });

      const data = await response.text();
      
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      res.send(data);
    } catch (error) {
      console.error('Proxy error:', error);
      throw new HttpException(
        'Service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
} 