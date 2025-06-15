import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InfraModule } from '@/libs/src/infra/infra.module';
import { RoutineController } from './infrastructure/controllers/routine.controller';
import { CreateRoutineUseCase } from './application/use-cases/create-routine.use-case';
import { UpdateRoutineUseCase } from './application/use-cases/update-routine.use-case';
import { ListTrainerRoutinesUseCase } from './application/use-cases/list-trainer-routines.use-case';
import { GetRoutineUseCase } from './application/use-cases/get-routine.use-case';
import { PrismaRoutineRepository } from './infrastructure/repositories/prisma-routine.repository';
import { IRoutineRepository } from './domain/repositories/routine.repository';
import { CoreModule, CorrelationIdMiddleware } from '@/libs/src/core';

@Module({
  imports: [InfraModule, CoreModule],
  controllers: [RoutineController],
  providers: [
    CreateRoutineUseCase,
    UpdateRoutineUseCase,
    DeleteRoutineUseCase,
    ListTrainerRoutinesUseCase,
    GetRoutineUseCase,
    {
      provide: IRoutineRepository,
      useClass: PrismaRoutineRepository,
    },
  ],
})
export class RoutinesModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 