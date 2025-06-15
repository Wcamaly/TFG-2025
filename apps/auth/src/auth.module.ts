import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { PrismaService } from '@infra/prisma/prisma.service';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { PrismaAuthRepository } from './infrastructure/persistence/prisma-auth.repository';
import { JwtTokenServiceImpl } from './infrastructure/services/jwt-token.service.impl';
import { PASSWORD_SERVICE } from './domain/services/password.service';
import { PasswordServiceImpl } from './infrastructure/services/password.service.impl';
import { CoreModule, EMAIL_SERVICE, JWT_TOKEN_SERVICE } from '@core/index';
import { EmailServiceImpl } from './infrastructure/services/email.service.impl';
import { InfraModule } from '@infra/infra.module';import { NotificationModule } from '@core/notifications/notification.module';

@Module({
  imports: [
    CoreModule,
    InfraModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
    {
      provide: JWT_TOKEN_SERVICE,
      useClass: JwtTokenServiceImpl,
    },
    {
      provide: PASSWORD_SERVICE,
      useClass: PasswordServiceImpl,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: EmailServiceImpl,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aquí podemos configurar middleware si es necesario
  }
} 