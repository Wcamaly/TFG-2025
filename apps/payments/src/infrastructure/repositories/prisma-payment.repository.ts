import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/src/infra/prisma/prisma.service';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: Payment): Promise<Payment> {
    const prismaPayment = await this.prisma.payment.create({
      data: {
        id: payment.getId(),
        userId: payment.getUserId(),
        gymId: payment.getGymId(),
        amount: payment.getAmount(),
        currency: payment.getCurrency(),
        provider: payment.getProvider(),
        status: payment.getStatus(),
        providerRef: payment.getProviderRef(),
        metadata: payment.getMetadata(),
        createdAt: payment.getCreatedAt(),
        updatedAt: payment.getUpdatedAt(),
      },
    });

    return this.toDomain(prismaPayment);
  }

  async findById(id: string): Promise<Payment | null> {
    const prismaPayment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!prismaPayment) {
      return null;
    }

    return this.toDomain(prismaPayment);
  }

  async findByUserId(userId: string, options?: {
    status?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<Payment[]> {
    const { status, startDate, endDate, page = 1, limit = 10 } = options || {};

    const prismaPayments = await this.prisma.payment.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } }),
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return prismaPayments.map(this.toDomain);
  }

  async update(payment: Payment): Promise<Payment> {
    const prismaPayment = await this.prisma.payment.update({
      where: { id: payment.getId() },
      data: {
        status: payment.getStatus(),
        providerRef: payment.getProviderRef(),
        metadata: payment.getMetadata(),
        updatedAt: payment.getUpdatedAt(),
      },
    });

    return this.toDomain(prismaPayment);
  }

  async findByReference(reference: string): Promise<Payment | null> {
    const prismaPayment = await this.prisma.payment.findFirst({
      where: { providerRef: reference },
    });

    if (!prismaPayment) {
      return null;
    }

    return this.toDomain(prismaPayment);
  }

  private toDomain(prismaPayment: any): Payment {
    return new Payment({
      id: prismaPayment.id,
      userId: prismaPayment.userId,
      gymId: prismaPayment.gymId,
      amount: prismaPayment.amount,
      currency: prismaPayment.currency,
      provider: prismaPayment.provider,
      status: prismaPayment.status as PaymentStatus,
      providerRef: prismaPayment.providerRef,
      metadata: prismaPayment.metadata,
      createdAt: prismaPayment.createdAt,
      updatedAt: prismaPayment.updatedAt,
    });
  }
} 