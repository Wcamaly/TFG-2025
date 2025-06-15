import { Module, Global } from '@nestjs/common';
import { BcryptPasswordHashingService } from './services/bcrypt-password-hashing.service';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { NotificationModule } from './notifications/notification.module';

@Global()
@Module({
  imports: [
    AuthModule, 
    NotificationModule,
    LoggerModule.forRoot({
    pinoHttp: {
      level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      transport: process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    },
    
  }),],
  providers: [
    BcryptPasswordHashingService,
  ],
  exports: [
    BcryptPasswordHashingService,
    AuthModule,
    NotificationModule,
  ],
})
export class CoreModule {} 