import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_SERVICE') private readonly redisClient: ClientProxy,
  ) {}

  async publish(pattern: string, data: any): Promise<void> {
    await firstValueFrom(this.redisClient.emit(pattern, data));
  }

  async send(pattern: string, data: any): Promise<any> {
    return firstValueFrom(this.redisClient.send(pattern, data));
  }

  async subscribe(pattern: string, callback: (data: any) => void): Promise<void> {
    this.redisClient.subscribe(pattern, callback);
  }
} 