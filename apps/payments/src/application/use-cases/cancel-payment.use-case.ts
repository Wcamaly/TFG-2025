import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RedisService, REDIS_PATTERNS } from '@/libs/src/infra/redis';
import { PaymentStatus } from '../../domain/entities/payment.entity';

export interface CancelPaymentCommand {
  paymentId: string;
  userId: string;
  reason?: string;
}

@Injectable()
export class CancelPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: CancelPaymentCommand): Promise<void> {
    const payment = await this.paymentRepository.findById(command.paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.getUserId() !== command.userId) {
      throw new Error('Unauthorized to cancel this payment');
    }

    payment.updateStatus(PaymentStatus.CANCELLED);
    if (command.reason) {
      payment.updateMetadata({ cancellationReason: command.reason });
    }

    await this.paymentRepository.update(payment);

    // Publicar evento de cancelación de pago
    await this.redisService.publish(REDIS_PATTERNS.PAYMENT_STATUS_CHANGED, {
      paymentId: payment.getId(),
      userId: payment.getUserId(),
      gymId: payment.getGymId(),
      status: payment.getStatus(),
      metadata: payment.getMetadata(),
    });
  }
} 