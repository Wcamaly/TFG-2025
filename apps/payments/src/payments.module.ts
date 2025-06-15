import { Module } from '@nestjs/common';
import { PaymentController } from './infrastructure/controllers/payment.controller';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case';
import { GetPaymentUseCase } from './application/use-cases/get-payment.use-case';
import { ListUserPaymentsUseCase } from './application/use-cases/list-user-payments.use-case';
import { HandlePaymentWebhookUseCase } from './application/use-cases/handle-payment-webhook.use-case';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { InfraModule } from '@/libs/src/infra/infra.module';


@Module({
  imports: [InfraModule],
  controllers: [PaymentController],
  providers: [
    CreatePaymentUseCase,
    GetPaymentUseCase,
    ListUserPaymentsUseCase,
    HandlePaymentWebhookUseCase,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [
    CreatePaymentUseCase,
    GetPaymentUseCase,
    ListUserPaymentsUseCase,
    HandlePaymentWebhookUseCase,
  ],
})
export class PaymentsModule {} 