import { Injectable, Inject } from '@nestjs/common';
import { TrainerOffert } from '../../domain/entities/trainer-offert.entity';
import { ITrainerOffertRepository, TRAINER_OFFERT_REPOSITORY } from '../../domain/repositories/trainer-offert.repository';

export interface CreateTrainerOffertDto {
  trainerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  durationInDays: number;
  includesBookings: boolean;
  bookingQuota?: number;
}

@Injectable()
export class CreateTrainerOffertUseCase {
  constructor(
    @Inject(TRAINER_OFFERT_REPOSITORY)
    private readonly trainerOffertRepository: ITrainerOffertRepository,
  ) {}

  async execute(dto: CreateTrainerOffertDto): Promise<TrainerOffert> {
    const offert = TrainerOffert.create(
      dto.trainerId,
      dto.title,
      dto.description,
      dto.price,
      dto.currency,
      dto.durationInDays,
      dto.includesBookings,
      dto.bookingQuota,
    );

    return this.trainerOffertRepository.create(offert);
  }
} 