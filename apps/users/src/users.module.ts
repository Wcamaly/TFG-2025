import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

// Infrastructure Dependencies
import { PrismaModule } from '@/libs/src/infra/prisma/prisma.module';

// Presentation Layer (Adapters)
import { UsersController } from '@/apps/users/src/presentation/controllers/users.controller';

// Application Layer (Use Cases)
import { ForgotPasswordUseCase } from '@/apps/users/src/application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '@/apps/users/src/application/use-cases/reset-password.use-case';
import { RegisterUserUseCase } from '@/apps/users/src/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '@/apps/users/src/application/use-cases/login-user.use-case';
import { GetMeUseCase } from '@/apps/users/src/application/use-cases/get-me.use-case';

// Application Ports (Interfaces) - Now imported from Core
import { PASSWORD_RECOVERY_SERVICE, PASSWORD_HASHING_SERVICE, JWT_TOKEN_SERVICE } from '@core/index';

// Domain Layer (Business Logic)
import { USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';

// Infrastructure Layer (Implementations)
import { UserRepositoryImpl } from '@/apps/users/src/infrastructure/persistence/user.repository.impl';
import { InMemoryPasswordRecoveryService } from '@/apps/users/src/infrastructure/services/in-memory-password-recovery.service';
import { JwtTokenServiceImpl } from '@/apps/users/src/infrastructure/services/jwt-token.service.impl';
import { CorrelationIdMiddleware } from '@core/middleware/correlation-id.middleware';

// Core Services
import { CoreModule, BcryptPasswordHashingService } from '@core/index';

@Module({
  imports: [
    PrismaModule,
    CoreModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    // Application Layer - Use Cases
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetMeUseCase,
    
    // Infrastructure Layer - Repository Implementation
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    
    // Infrastructure Layer - Service Implementations
    {
      provide: PASSWORD_RECOVERY_SERVICE,
      useClass: InMemoryPasswordRecoveryService,
    },
    {
      provide: PASSWORD_HASHING_SERVICE,
      useClass: BcryptPasswordHashingService,
    },
    {
      provide: JWT_TOKEN_SERVICE,
      useClass: JwtTokenServiceImpl,
    },
  ],
  exports: [
    // Export para otros módulos que necesiten acceder al repositorio
    USER_REPOSITORY,
  ],
})
export class UsersModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 