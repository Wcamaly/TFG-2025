import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RedisService, REDIS_PATTERNS } from '@/libs/src/infra/redis';

export interface CreatePaymentCommand {
  userId: string;
  gymId: string;
  amount: number;
  currency: string;
  provider: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<Payment> {
    const payment = new Payment({
      userId: command.userId,
      gymId: command.gymId,
      amount: command.amount,
      currency: command.currency,
      provider: command.provider,
      status: PaymentStatus.PENDING,
      metadata: command.metadata,
    });

    const createdPayment = await this.paymentRepository.create(payment);

    // Publicar evento de pago creado
    await this.redisService.publish(REDIS_PATTERNS.PAYMENT_CREATED, {
      paymentId: createdPayment.getId(),
      userId: createdPayment.getUserId(),
      gymId: createdPayment.getGymId(),
      amount: createdPayment.getAmount(),
      currency: createdPayment.getCurrency(),
      provider: createdPayment.getProvider(),
      status: createdPayment.getStatus(),
    });

    return createdPayment;
  }
} 