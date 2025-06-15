import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

// Infrastructure Dependencies
import { PrismaModule } from '@/libs/src/infra/prisma/prisma.module';

// Presentation Layer (Adapters)
import { UsersController } from '@/apps/users/src/presentation/controllers/users.controller';


// Domain Layer (Business Logic)
import { USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';

// Infrastructure Layer (Implementations)
import { UserRepositoryImpl } from '@/apps/users/src/infrastructure/persistence/user.repository.impl';
import { CorrelationIdMiddleware } from '@core/middleware/correlation-id.middleware';

// Core Services
import { CoreModule } from '@core/index';

// Application Layer (Use Cases)
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserPreferencesUseCase } from './application/use-cases/get-user-preferences.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserPreferencesUseCase } from './application/use-cases/update-user-preferences.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';

@Module({
  imports: [
    PrismaModule,
    CoreModule,
  ],
  controllers: [UsersController],
  providers: [
    // Application Layer - Use Cases
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    GetUserPreferencesUseCase,
    UpdateUserPreferencesUseCase,
    
    // Infrastructure Layer - Repository Implementation
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    USER_REPOSITORY,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 