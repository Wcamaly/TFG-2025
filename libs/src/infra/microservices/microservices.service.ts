import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MicroservicesService {
  private readonly logger = new Logger(MicroservicesService.name);
  private readonly httpClients: Map<string, AxiosInstance> = new Map();
  private readonly eventClients: Map<string, ClientProxy> = new Map();

  constructor(private readonly configService: ConfigService) {}

  // Método para obtener un cliente HTTP para un servicio específico
  getHttpClient(serviceName: string): AxiosInstance {
    if (!this.httpClients.has(serviceName)) {
      const baseURL = this.configService.get<string>(`${serviceName.toUpperCase()}_SERVICE_URL`);
      const client = axios.create({
        baseURL,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Interceptor para logging
      client.interceptors.request.use(
        (config) => {
          this.logger.debug(`HTTP Request to ${serviceName}: ${config.method?.toUpperCase()} ${config.url}`);
          return config;
        },
        (error) => {
          this.logger.error(`HTTP Request Error to ${serviceName}:`, error);
          return Promise.reject(error);
        }
      );

      client.interceptors.response.use(
        (response) => {
          this.logger.debug(`HTTP Response from ${serviceName}: ${response.status}`);
          return response;
        },
        (error) => {
          this.logger.error(`HTTP Response Error from ${serviceName}:`, error);
          return Promise.reject(error);
        }
      );

      this.httpClients.set(serviceName, client);
    }

    return this.httpClients.get(serviceName)!;
  }

  // Método para obtener un cliente de eventos para un servicio específico
  getEventClient(serviceName: string): ClientProxy {
    if (!this.eventClients.has(serviceName)) {
      const client = ClientProxyFactory.create({
        transport: Transport.REDIS,
        options: {
          host: this.configService.get<string>('REDIS_HOST', 'localhost'),
          port: this.configService.get<number>('REDIS_PORT', 6379),
        },
      });

      this.eventClients.set(serviceName, client);
    }

    return this.eventClients.get(serviceName)!;
  }

  // Método para hacer una petición HTTP
  async httpRequest<T>(
    serviceName: string,
    config: AxiosRequestConfig
  ): Promise<T> {
    const client = this.getHttpClient(serviceName);
    try {
      const response = await client.request<T>(config);
      return response.data;
    } catch (error) {
      this.logger.error(`Error in HTTP request to ${serviceName}:`, error);
      throw error;
    }
  }

  // Método para publicar un evento
  async publishEvent<T>(
    serviceName: string,
    pattern: string,
    data: T
  ): Promise<void> {
    const client = this.getEventClient(serviceName);
    try {
      await client.emit(pattern, data).toPromise();
      this.logger.debug(`Event published to ${serviceName}: ${pattern}`);
    } catch (error) {
      this.logger.error(`Error publishing event to ${serviceName}:`, error);
      throw error;
    }
  }

  // Método para suscribirse a un evento
  subscribeToEvent<T>(
    serviceName: string,
    pattern: string,
    callback: (data: T) => void
  ): void {
    const client = this.getEventClient(serviceName);
    client.subscribe<T>(pattern, (data) => {
      this.logger.debug(`Event received from ${serviceName}: ${pattern}`);
      callback(data);
    });
  }

  // Método para cerrar todas las conexiones
  async close(): Promise<void> {
    for (const client of this.eventClients.values()) {
      await client.close();
    }
    this.eventClients.clear();
    this.httpClients.clear();
  }
} 