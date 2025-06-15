import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@infra/redis';
import { NotificationsService } from './application/use-cases/notifications.service';
import { EMAIL_SERVICE } from './domain/services/email.service';
import { EmailServiceImpl } from './infrastructure/services/email.service.impl';
import { PUSH_NOTIFICATION_SERVICE } from './domain/services/push-notification.service';
import { PushNotificationServiceImpl } from './infrastructure/services/push-notification.service.impl';
import { SMS_SERVICE } from './domain/services/sms.service';
import { SmsServiceImpl } from './infrastructure/services/sms.service.impl';
import { NotificationSubscriber } from './infrastructure/messaging/notification.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
  ],
  providers: [
    NotificationsService,
    NotificationSubscriber,
    {
      provide: EMAIL_SERVICE,
      useClass: EmailServiceImpl,
    },
    {
      provide: PUSH_NOTIFICATION_SERVICE,
      useClass: PushNotificationServiceImpl,
    },
    {
      provide: SMS_SERVICE,
      useClass: SmsServiceImpl,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {} 