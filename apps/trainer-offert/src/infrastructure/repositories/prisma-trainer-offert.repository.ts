import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { TrainerOffert } from '../../domain/entities/trainer-offert.entity';
import { ITrainerOffertRepository } from '../../domain/repositories/trainer-offert.repository';

@Injectable()
export class PrismaTrainerOffertRepository implements ITrainerOffertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(offert: TrainerOffert): Promise<TrainerOffert> {
    const created = await this.prisma.trainerOffert.create({
      data: {
        id: offert.id,
        trainerId: offert.trainerId,
        title: offert.title,
        description: offert.description,
        price: offert.price,
        currency: offert.currency,
        durationInDays: offert.durationInDays,
        includesBookings: offert.includesBookings,
        bookingQuota: offert.bookingQuota,
        createdAt: offert.createdAt,
        isActive: offert.isActive,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<TrainerOffert | null> {
    const offert = await this.prisma.trainerOffert.findUnique({
      where: { id },
    });

    return offert ? this.toDomain(offert) : null;
  }

  async findByTrainerId(trainerId: string): Promise<TrainerOffert[]> {
    const offerts = await this.prisma.trainerOffert.findMany({
      where: { trainerId },
    });

    return offerts.map(this.toDomain);
  }

  async findActiveByTrainerId(trainerId: string): Promise<TrainerOffert[]> {
    const offerts = await this.prisma.trainerOffert.findMany({
      where: {
        trainerId,
        isActive: true,
      },
    });

    return offerts.map(this.toDomain);
  }

  async update(offert: TrainerOffert): Promise<TrainerOffert> {
    const updated = await this.prisma.trainerOffert.update({
      where: { id: offert.id },
      data: {
        title: offert.title,
        description: offert.description,
        price: offert.price,
        currency: offert.currency,
        durationInDays: offert.durationInDays,
        includesBookings: offert.includesBookings,
        bookingQuota: offert.bookingQuota,
        isActive: offert.isActive,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.trainerOffert.delete({
      where: { id },
    });
  }

  private toDomain(prismaOffert: any): TrainerOffert {
    return new TrainerOffert(
      prismaOffert.id,
      prismaOffert.trainerId,
      prismaOffert.title,
      prismaOffert.description,
      prismaOffert.price,
      prismaOffert.currency,
      prismaOffert.durationInDays,
      prismaOffert.includesBookings,
      prismaOffert.bookingQuota,
      prismaOffert.createdAt,
      prismaOffert.isActive,
    );
  }
} 