import { Injectable } from '@nestjs/common';
import { RedisService } from '@infra/redis';
import { NOTIFICATION_PATTERN } from './notification.constants';
import { NotificationPayload } from './notification.types';


@Injectable()
export class NotificationEmitter {
  constructor(private readonly redisService: RedisService) {}

  async emit(payload: NotificationPayload): Promise<void> {
    await this.redisService.publish(NOTIFICATION_PATTERN, payload);
  }

  async emitBatch(payloads: NotificationPayload[]): Promise<void> {
    await Promise.all(payloads.map(payload => this.emit(payload)));
  }
} 