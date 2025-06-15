import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository } from '../../domain/repositories/booking.repository';
import { BookingStatus } from '../../domain/entities/booking-status.enum';

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(booking: Booking): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        trainerId: booking.trainerId,
        gymId: booking.gymId,
        date: booking.date,
        status: booking.status,
        quotaId: booking.quotaId,
        createdAt: booking.createdAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    return booking ? this.toDomain(booking) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
    });

    return bookings.map(this.toDomain);
  }

  async findByTrainerId(trainerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { trainerId },
    });

    return bookings.map(this.toDomain);
  }

  async findByGymId(gymId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { gymId },
    });

    return bookings.map(this.toDomain);
  }

  async update(booking: Booking): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({
      where: { id },
    });
  }

  private toDomain(prismaBooking: any): Booking {
    return new Booking(
      prismaBooking.id,
      prismaBooking.userId,
      prismaBooking.trainerId,
      prismaBooking.gymId,
      prismaBooking.date,
      prismaBooking.status as BookingStatus,
      prismaBooking.quotaId,
      prismaBooking.createdAt,
    );
  }
} 