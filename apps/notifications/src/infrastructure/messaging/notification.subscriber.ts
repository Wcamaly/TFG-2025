import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@infra/redis';
import { NotificationsService } from '../../application/use-cases/notifications.service';
import { NotificationPayload, NOTIFICATION_PATTERN } from '@core/notifications/notification.emitter';

@Injectable()
export class NotificationSubscriber implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.subscribe();
  }

  private async subscribe() {
    await this.redisService.subscribe(NOTIFICATION_PATTERN, async (payload: NotificationPayload) => {
      try {
        await this.processNotification(payload);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });
  }

  private async processNotification(payload: NotificationPayload) {
    switch (payload.type) {
      case 'email':
        await this.notificationsService.sendEmail(
          { to: payload.data.to },
          {
            subject: payload.data.subject,
            html: payload.data.html,
          },
        );
        break;

      case 'push':
        await this.notificationsService.sendPushNotification(
          { token: payload.data.token },
          {
            title: payload.data.title,
            body: payload.data.body,
            data: payload.data.data,
          },
        );
        break;

      case 'sms':
        await this.notificationsService.sendSms(
          { to: payload.data.to },
          payload.data.message,
        );
        break;

      default:
        console.warn('Unknown notification type:', payload.type);
    }
  }
} 