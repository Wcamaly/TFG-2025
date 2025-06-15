import { Injectable } from '@nestjs/common';

import { RedisService, REDIS_PATTERNS } from '@/libs/src/infra/redis';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentStatus } from '../../domain/entities/payment.entity';

export interface HandlePaymentWebhookCommand {
  paymentId: string;
  status: PaymentStatus;
  providerRef: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: HandlePaymentWebhookCommand): Promise<void> {
    const payment = await this.paymentRepository.findById(command.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.updateStatus(command.status);
    payment.updateProviderRef(command.providerRef);
    if (command.metadata) {
      payment.updateMetadata(command.metadata);
    }

    await this.paymentRepository.update(payment);

    // Publicar evento de cambio de estado del pago
    await this.redisService.publish(REDIS_PATTERNS.PAYMENT_STATUS_CHANGED, {
      paymentId: payment.getId(),
      userId: payment.getUserId(),
      gymId: payment.getGymId(),
      status: payment.getStatus(),
      providerRef: payment.getProviderRef(),
    });
  }
} 