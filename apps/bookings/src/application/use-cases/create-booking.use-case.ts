import { Injectable, Inject } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingQuota } from '../../domain/entities/booking-quota.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import { IBookingQuotaRepository, BOOKING_QUOTA_REPOSITORY } from '../../domain/repositories/booking-quota.repository';

export interface CreateBookingDto {
  userId: string;
  trainerId: string | null;
  gymId: string;
  date: Date;
  quotaId: string;
}

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    @Inject(BOOKING_QUOTA_REPOSITORY)
    private readonly quotaRepository: IBookingQuotaRepository,
  ) {}

  async execute(dto: CreateBookingDto): Promise<Booking> {
    // 1. Verificar que el cupo existe y es válido
    const quota = await this.quotaRepository.findById(dto.quotaId);
    if (!quota) {
      throw new Error('Quota not found');
    }

    if (!quota.isValid()) {
      throw new Error('Quota is not valid or has expired');
    }

    if (quota.userId !== dto.userId) {
      throw new Error('Quota does not belong to the user');
    }

    // 2. Consumir el cupo
    const updatedQuota = quota.consume();
    await this.quotaRepository.update(updatedQuota);

    // 3. Crear la reserva
    const booking = Booking.create(
      dto.userId,
      dto.trainerId,
      dto.gymId,
      dto.date,
      dto.quotaId,
    );

    // 4. Guardar la reserva
    return this.bookingRepository.create(booking);
  }
} 