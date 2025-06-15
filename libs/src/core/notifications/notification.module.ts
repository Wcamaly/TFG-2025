import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationEmitter } from './notification.emitter';

@Module({
  imports: [ConfigModule],
  providers: [NotificationEmitter],
  exports: [NotificationEmitter],
})
export class NotificationModule {} 