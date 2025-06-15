import { Booking } from '../entities/booking.entity';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByTrainerId(trainerId: string): Promise<Booking[]>;
  findByGymId(gymId: string): Promise<Booking[]>;
  update(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<void>;
} 