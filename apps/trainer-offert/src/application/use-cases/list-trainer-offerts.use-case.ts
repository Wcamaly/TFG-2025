import { Injectable, Inject } from '@nestjs/common';
import { TrainerOffert } from '../../domain/entities/trainer-offert.entity';
import { ITrainerOffertRepository, TRAINER_OFFERT_REPOSITORY } from '../../domain/repositories/trainer-offert.repository';

export interface ListTrainerOffertsDto {
  trainerId: string;
  activeOnly?: boolean;
}

@Injectable()
export class ListTrainerOffertsUseCase {
  constructor(
    @Inject(TRAINER_OFFERT_REPOSITORY)
    private readonly trainerOffertRepository: ITrainerOffertRepository,
  ) {}

  async execute(dto: ListTrainerOffertsDto): Promise<TrainerOffert[]> {
    if (!dto.trainerId) {
      throw new Error('Trainer ID is required');
    }

    if (dto.activeOnly) {
      return this.trainerOffertRepository.findActiveByTrainerId(dto.trainerId);
    }

    return this.trainerOffertRepository.findByTrainerId(dto.trainerId);
  }
} 