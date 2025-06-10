import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationIdMiddleware } from '@core/middleware/correlation-id.middleware';
import { PrismaClient } from '@prisma/client';

// Controllers
import { TrainersController } from './presentation/controllers/trainers.controller';

// Use Cases
import { CreateTrainerUseCase } from './application/use-cases/create-trainer.use-case';
import { GetTrainerByIdUseCase } from './application/use-cases/get-trainer-by-id.use-case';
import { SearchTrainersUseCase } from './application/use-cases/search-trainers.use-case';
import { UpdateTrainerUseCase } from './application/use-cases/update-trainer.use-case';
import { DeleteTrainerUseCase } from './application/use-cases/delete-trainer.use-case';

// Repositories
import { TRAINER_REPOSITORY } from './infrastructure/tokens';
import { PrismaTrainerRepository } from './infrastructure/repositories/prisma-trainer.repository';
import { PrismaModule } from '@/libs/src/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainersController],
  providers: [
    
    // Repositories
    {
      provide: TRAINER_REPOSITORY,
      useClass: PrismaTrainerRepository,
    },
    
    // Use Cases
    CreateTrainerUseCase,
    GetTrainerByIdUseCase,
    SearchTrainersUseCase,
    UpdateTrainerUseCase,
    DeleteTrainerUseCase,
  ],
  exports: [
    TRAINER_REPOSITORY,
    CreateTrainerUseCase,
    GetTrainerByIdUseCase,
    SearchTrainersUseCase,
    UpdateTrainerUseCase,
    DeleteTrainerUseCase,
  ],
})
export class TrainersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 