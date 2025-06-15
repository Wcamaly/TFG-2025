import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { BookingQuota } from '../../domain/entities/booking-quota.entity';
import { IBookingQuotaRepository } from '../../domain/repositories/booking-quota.repository';

@Injectable()
export class PrismaBookingQuotaRepository implements IBookingQuotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(quota: BookingQuota): Promise<BookingQuota> {
    const created = await this.prisma.bookingQuota.create({
      data: {
        id: quota.id,
        userId: quota.userId,
        total: quota.total,
        remaining: quota.remaining,
        validFrom: quota.validFrom,
        validUntil: quota.validUntil,
        paymentId: quota.paymentId,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<BookingQuota | null> {
    const quota = await this.prisma.bookingQuota.findUnique({
      where: { id },
    });

    return quota ? this.toDomain(quota) : null;
  }

  async findByUserId(userId: string): Promise<BookingQuota[]> {
    const quotas = await this.prisma.bookingQuota.findMany({
      where: { userId },
    });

    return quotas.map(this.toDomain);
  }

  async findByPaymentId(paymentId: string): Promise<BookingQuota[]> {
    const quotas = await this.prisma.bookingQuota.findMany({
      where: { paymentId },
    });

    return quotas.map(this.toDomain);
  }

  async findValidQuotasByUserId(userId: string): Promise<BookingQuota[]> {
    const now = new Date();
    const quotas = await this.prisma.bookingQuota.findMany({
      where: {
        userId,
        validFrom: { lte: now },
        validUntil: { gte: now },
        remaining: { gt: 0 },
      },
    });

    return quotas.map(this.toDomain);
  }

  async update(quota: BookingQuota): Promise<BookingQuota> {
    const updated = await this.prisma.bookingQuota.update({
      where: { id: quota.id },
      data: {
        remaining: quota.remaining,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bookingQuota.delete({
      where: { id },
    });
  }

  private toDomain(prismaQuota: any): BookingQuota {
    return new BookingQuota(
      prismaQuota.id,
      prismaQuota.userId,
      prismaQuota.total,
      prismaQuota.remaining,
      prismaQuota.validFrom,
      prismaQuota.validUntil,
      prismaQuota.paymentId,
    );
  }
} 