import { BookingStatus } from '../enums/booking-status.enum';

export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly trainerId: string | null,
    public readonly gymId: string,
    public readonly date: Date,
    public readonly status: BookingStatus,
    public readonly quotaId: string,
    public readonly createdAt: Date,
  ) {}

  public static create(
    userId: string,
    trainerId: string | null,
    gymId: string,
    date: Date,
    quotaId: string,
  ): Booking {
    return new Booking(
      crypto.randomUUID(),
      userId,
      trainerId,
      gymId,
      date,
      BookingStatus.PENDING,
      quotaId,
      new Date(),
    );
  }

  public cancel(): Booking {
    if (this.status !== BookingStatus.PENDING && this.status !== BookingStatus.CONFIRMED) {
      throw new Error('Cannot cancel a booking that is not pending or confirmed');
    }

    return new Booking(
      this.id,
      this.userId,
      this.trainerId,
      this.gymId,
      this.date,
      BookingStatus.CANCELLED,
      this.quotaId,
      this.createdAt,
    );
  }

  public confirm(): Booking {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Cannot confirm a booking that is not pending');
    }

    return new Booking(
      this.id,
      this.userId,
      this.trainerId,
      this.gymId,
      this.date,
      BookingStatus.CONFIRMED,
      this.quotaId,
      this.createdAt,
    );
  }

  public complete(): Booking {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error('Cannot complete a booking that is not confirmed');
    }

    return new Booking(
      this.id,
      this.userId,
      this.trainerId,
      this.gymId,
      this.date,
      BookingStatus.COMPLETED,
      this.quotaId,
      this.createdAt,
    );
  }
} 