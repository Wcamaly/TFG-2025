import { Injectable, Inject } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';

export interface ListBookingsDto {
  userId?: string;
  trainerId?: string;
  gymId?: string;
}

@Injectable()
export class ListBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(dto: ListBookingsDto): Promise<Booking[]> {
    if (dto.userId) {
      return this.bookingRepository.findByUserId(dto.userId);
    }

    if (dto.trainerId) {
      return this.bookingRepository.findByTrainerId(dto.trainerId);
    }

    if (dto.gymId) {
      return this.bookingRepository.findByGymId(dto.gymId);
    }

    throw new Error('At least one filter parameter is required');
  }
} 