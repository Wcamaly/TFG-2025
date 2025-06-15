import { Injectable, Inject } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import { IBookingQuotaRepository, BOOKING_QUOTA_REPOSITORY } from '../../domain/repositories/booking-quota.repository';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    @Inject(BOOKING_QUOTA_REPOSITORY)
    private readonly quotaRepository: IBookingQuotaRepository,
  ) {}

  async execute(bookingId: string, userId: string): Promise<Booking> {
    // 1. Verificar que la reserva existe
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // 2. Verificar que el usuario es el propietario de la reserva
    if (booking.userId !== userId) {
      throw new Error('User is not authorized to cancel this booking');
    }

    // 3. Cancelar la reserva
    const cancelledBooking = booking.cancel();
    await this.bookingRepository.update(cancelledBooking);

    // 4. Devolver el cupo
    const quota = await this.quotaRepository.findById(booking.quotaId);
    if (quota) {
      const updatedQuota = quota.refund();
      await this.quotaRepository.update(updatedQuota);
    }

    return cancelledBooking;
  }
} 