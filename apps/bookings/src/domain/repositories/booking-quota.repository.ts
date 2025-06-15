import { BookingQuota } from '../entities/booking-quota.entity';

export const BOOKING_QUOTA_REPOSITORY = Symbol('BOOKING_QUOTA_REPOSITORY');

export interface IBookingQuotaRepository {
  create(quota: BookingQuota): Promise<BookingQuota>;
  findById(id: string): Promise<BookingQuota | null>;
  findByUserId(userId: string): Promise<BookingQuota[]>;
  findByPaymentId(paymentId: string): Promise<BookingQuota[]>;
  findValidQuotasByUserId(userId: string): Promise<BookingQuota[]>;
  update(quota: BookingQuota): Promise<BookingQuota>;
  delete(id: string): Promise<void>;
} 