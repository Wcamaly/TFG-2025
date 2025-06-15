import { Injectable, Inject } from '@nestjs/common';
import { TrainerSubscription } from '../../domain/entities/trainer-subscription.entity';
import { ITrainerSubscriptionRepository, TRAINER_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/trainer-subscription.repository';

export interface ListUserSubscriptionsDto {
  userId: string;
  activeOnly?: boolean;
}

@Injectable()
export class ListUserSubscriptionsUseCase {
  constructor(
    @Inject(TRAINER_SUBSCRIPTION_REPOSITORY)
    private readonly trainerSubscriptionRepository: ITrainerSubscriptionRepository,
  ) {}

  async execute(dto: ListUserSubscriptionsDto): Promise<TrainerSubscription[]> {
    if (dto.activeOnly) {
      return this.trainerSubscriptionRepository.findActiveByUserId(dto.userId);
    }
    return this.trainerSubscriptionRepository.findByUserId(dto.userId);
  }
} 