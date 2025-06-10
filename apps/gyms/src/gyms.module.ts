import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationIdMiddleware } from '@core/middleware/correlation-id.middleware';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { CoreModule } from '@core/index';

// Controllers
import { GymsController } from './presentation/controllers/gyms.controller';

// Use Cases
import { CreateGymUseCase } from './application/use-cases/create-gym.use-case';
import { UpdateGymUseCase } from './application/use-cases/update-gym.use-case';
import { FindGymsByLocationUseCase } from './application/use-cases/find-gyms-by-location.use-case';
import { GetGymDetailsUseCase } from './application/use-cases/get-gym-details.use-case';
import { DeleteGymUseCase } from './application/use-cases/delete-gym.use-case';

// Repositories
import { GymRepository } from './domain/repositories/gym.repository';
import { PrismaGymRepository } from './infrastructure/repositories/prisma-gym.repository';

@Module({
  imports: [
    PrismaModule, 
    CoreModule, // Importa CoreModule que ahora incluye AuthModule con JWT
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    }),
  ],
  controllers: [GymsController],
  providers: [
    // Use Cases
    CreateGymUseCase,
    UpdateGymUseCase,
    FindGymsByLocationUseCase,
    GetGymDetailsUseCase,
    DeleteGymUseCase,
    
    // Repository Implementation
    {
      provide: 'GymRepository',
      useClass: PrismaGymRepository,
    },
  ],
})
export class GymsModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 