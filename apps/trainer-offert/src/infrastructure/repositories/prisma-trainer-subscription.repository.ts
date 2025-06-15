import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { TrainerSubscription } from '../../domain/entities/trainer-subscription.entity';
import { ITrainerSubscriptionRepository } from '../../domain/repositories/trainer-subscription.repository';
import { SubscriptionStatus } from '../../domain/enums/subscription-status.enum';

@Injectable()
export class PrismaTrainerSubscriptionRepository implements ITrainerSubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(subscription: TrainerSubscription): Promise<TrainerSubscription> {
    const created = await this.prisma.trainerSubscription.create({
      data: {
        id: subscription.id,
        userId: subscription.userId,
        offertId: subscription.offertId,
        validFrom: subscription.validFrom,
        validUntil: subscription.validUntil,
        status: subscription.status,
        paymentId: subscription.paymentId,
        createdAt: subscription.createdAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<TrainerSubscription | null> {
    const subscription = await this.prisma.trainerSubscription.findUnique({
      where: { id },
    });

    return subscription ? this.toDomain(subscription) : null;
  }

  async findByUserId(userId: string): Promise<TrainerSubscription[]> {
    const subscriptions = await this.prisma.trainerSubscription.findMany({
      where: { userId },
    });

    return subscriptions.map(this.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<TrainerSubscription[]> {
    const subscriptions = await this.prisma.trainerSubscription.findMany({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        validUntil: {
          gt: new Date(),
        },
      },
    });

    return subscriptions.map(this.toDomain);
  }

  async findByOffertId(offertId: string): Promise<TrainerSubscription[]> {
    const subscriptions = await this.prisma.trainerSubscription.findMany({
      where: { offertId },
    });

    return subscriptions.map(this.toDomain);
  }

  async findByPaymentId(paymentId: string): Promise<TrainerSubscription[]> {
    const subscriptions = await this.prisma.trainerSubscription.findMany({
      where: { paymentId },
    });

    return subscriptions.map(this.toDomain);
  }

  async update(subscription: TrainerSubscription): Promise<TrainerSubscription> {
    const updated = await this.prisma.trainerSubscription.update({
      where: { id: subscription.id },
      data: {
        validFrom: subscription.validFrom,
        validUntil: subscription.validUntil,
        status: subscription.status,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.trainerSubscription.delete({
      where: { id },
    });
  }

  private toDomain(prismaSubscription: any): TrainerSubscription {
    return new TrainerSubscription(
      prismaSubscription.id,
      prismaSubscription.userId,
      prismaSubscription.offertId,
      prismaSubscription.validFrom,
      prismaSubscription.validUntil,
      prismaSubscription.status,
      prismaSubscription.paymentId,
      prismaSubscription.createdAt,
    );
  }
} 