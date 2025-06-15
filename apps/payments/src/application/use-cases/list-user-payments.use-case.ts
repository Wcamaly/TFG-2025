import { Injectable } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';

export interface ListUserPaymentsDto {
  userId: string;
  page?: number;
  limit?: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ListUserPaymentsResult {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListUserPaymentsUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(dto: ListUserPaymentsDto): Promise<ListUserPaymentsResult> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    // Get user payments
    const payments = await this.paymentRepository.findByUserId(dto.userId);

    // Apply filters
    let filteredPayments = payments;

    if (dto.status) {
      filteredPayments = filteredPayments.filter(
        payment => payment.getStatus().toLowerCase() === dto.status?.toLowerCase(),
      );
    }

    if (dto.startDate) {
      filteredPayments = filteredPayments.filter(
        payment => payment.getCreatedAt() >= dto.startDate!,
      );
    }

    if (dto.endDate) {
      filteredPayments = filteredPayments.filter(
        payment => payment.getCreatedAt() <= dto.endDate!,
      );
    }

    // Apply pagination
    const paginatedPayments = filteredPayments.slice(skip, skip + limit);
    const total = filteredPayments.length;
    const totalPages = Math.ceil(total / limit);

    return {
      payments: paginatedPayments,
      total,
      page,
      limit,
      totalPages,
    };
  }
} 