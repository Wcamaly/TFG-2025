import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InfraModule } from '@/libs/src/infra/infra.module';
import { TrainerOffertController } from './infrastructure/controllers/trainer-offert.controller';
import { CreateTrainerOffertUseCase } from './application/use-cases/create-trainer-offert.use-case';
import { CreateSubscriptionFromPaymentUseCase } from './application/use-cases/create-subscription-from-payment.use-case';
import { ListTrainerOffertsUseCase } from './application/use-cases/list-trainer-offerts.use-case';
import { ListUserSubscriptionsUseCase } from './application/use-cases/list-user-subscriptions.use-case';
import { PrismaTrainerOffertRepository } from './infrastructure/repositories/prisma-trainer-offert.repository';
import { PrismaTrainerSubscriptionRepository } from './infrastructure/repositories/prisma-trainer-subscription.repository';
import { TRAINER_OFFERT_REPOSITORY } from './domain/repositories/trainer-offert.repository';
import { TRAINER_SUBSCRIPTION_REPOSITORY } from './domain/repositories/trainer-subscription.repository';
import { CoreModule, CorrelationIdMiddleware } from '@/libs/src/core';

@Module({
  imports: [
    InfraModule,
    CoreModule,
  ],
  controllers: [TrainerOffertController],
  providers: [
    CreateTrainerOffertUseCase,
    CreateSubscriptionFromPaymentUseCase,
    ListTrainerOffertsUseCase,
    ListUserSubscriptionsUseCase,
    {
      provide: TRAINER_OFFERT_REPOSITORY,
      useClass: PrismaTrainerOffertRepository,
    },
    {
      provide: TRAINER_SUBSCRIPTION_REPOSITORY,
      useClass: PrismaTrainerSubscriptionRepository,
    },
  ],
  exports: [
    CreateTrainerOffertUseCase,
    CreateSubscriptionFromPaymentUseCase,
    ListTrainerOffertsUseCase,
    ListUserSubscriptionsUseCase,
  ],
})
export class TrainerOffertModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 