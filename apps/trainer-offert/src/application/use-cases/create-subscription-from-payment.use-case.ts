import { Injectable, Inject } from '@nestjs/common';
import { TrainerSubscription } from '../../domain/entities/trainer-subscription.entity';
import { ITrainerSubscriptionRepository, TRAINER_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/trainer-subscription.repository';
import { ITrainerOffertRepository, TRAINER_OFFERT_REPOSITORY } from '../../domain/repositories/trainer-offert.repository';
import { RedisService } from '@/libs/src/infra/redis';
import { REDIS_PATTERNS } from '@/libs/src/infra/redis';

export interface CreateSubscriptionFromPaymentDto {
  userId: string;
  offertId: string;
  paymentId: string;
}

@Injectable()
export class CreateSubscriptionFromPaymentUseCase {
  constructor(
    @Inject(TRAINER_SUBSCRIPTION_REPOSITORY)
    private readonly trainerSubscriptionRepository: ITrainerSubscriptionRepository,
    @Inject(TRAINER_OFFERT_REPOSITORY)
    private readonly trainerOffertRepository: ITrainerOffertRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(dto: CreateSubscriptionFromPaymentDto): Promise<TrainerSubscription> {
    const offert = await this.trainerOffertRepository.findById(dto.offertId);
    if (!offert || !offert.isActive) {
      throw new Error('Offert not found or not active');
    }

    const validFrom = new Date();
    const validUntil = new Date(validFrom);
    validUntil.setDate(validUntil.getDate() + offert.durationInDays);

    const subscription = TrainerSubscription.create(
      dto.userId,
      dto.offertId,
      validFrom,
      validUntil,
      dto.paymentId,
    );

    const createdSubscription = await this.trainerSubscriptionRepository.create(subscription);

    await this.redisService.publish(REDIS_PATTERNS.SUBSCRIPTION_CREATED, {
      userId: dto.userId,
      trainerId: offert.trainerId,
      bookingQuota: offert.bookingQuota,
      validUntil,
      subscriptionId: createdSubscription.id,
    });

    return createdSubscription;
  }
} 