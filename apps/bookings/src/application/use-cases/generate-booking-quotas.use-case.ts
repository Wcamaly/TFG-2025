import { Injectable, Inject } from '@nestjs/common';
import { BookingQuota } from '../../domain/entities/booking-quota.entity';
import { IBookingQuotaRepository, BOOKING_QUOTA_REPOSITORY } from '../../domain/repositories/booking-quota.repository';

export interface GenerateQuotasDto {
  userId: string;
  paymentId: string;
  totalQuotas: number;
  validFrom: Date;
  validUntil: Date;
}

@Injectable()
export class GenerateBookingQuotasUseCase {
  constructor(
    @Inject(BOOKING_QUOTA_REPOSITORY)
    private readonly quotaRepository: IBookingQuotaRepository,
  ) {}

  async execute(dto: GenerateQuotasDto): Promise<BookingQuota> {
    // 1. Verificar que no existan cupos para este pago
    const existingQuotas = await this.quotaRepository.findByPaymentId(dto.paymentId);
    if (existingQuotas.length > 0) {
      throw new Error('Quotas already exist for this payment');
    }

    // 2. Crear el cupo
    const quota = BookingQuota.create(
      dto.userId,
      dto.totalQuotas,
      dto.validFrom,
      dto.validUntil,
      dto.paymentId,
    );

    // 3. Guardar el cupo
    return this.quotaRepository.create(quota);
  }
} 