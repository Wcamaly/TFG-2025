import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@/libs/src/core/decorators/roles.decorator';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment.use-case';
import { HandlePaymentWebhookUseCase } from '../../application/use-cases/handle-payment-webhook.use-case';
import { ListUserPaymentsUseCase } from '../../application/use-cases/list-user-payments.use-case';
import { CancelPaymentUseCase } from '../../application/use-cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../../application/use-cases/get-payment.use-case';
import { CreatePaymentDto, HandlePaymentWebhookDto } from '../dtos';
import { PaymentStatus } from '../../domain/entities/payment.entity';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase,
    private readonly listUserPaymentsUseCase: ListUserPaymentsUseCase,
    private readonly cancelPaymentUseCase: CancelPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
  ) {}

  @Post()
  @Roles('USER')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@Body() dto: CreatePaymentDto) {
    try {
      return await this.createPaymentUseCase.execute(dto);
    } catch (error: any) {
      throw new BadRequestException(error?.message || 'Error creating payment');
    }
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found' })
  async getPayment(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.getPaymentUseCase.execute(id);
    } catch (error: any) {
      if (error?.message === 'Payment not found') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error?.message || 'Error getting payment');
    }
  }

  @Get('user/:userId')
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'List user payments' })
  @ApiResponse({ status: 200, description: 'List of user payments' })
  async listUserPayments(
    @Param('userId') userId: string,
    @Query() query: { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number },
  ) {
    try {
      return await this.listUserPaymentsUseCase.execute({
        userId,
        status: query.status as PaymentStatus,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        page: query.page,
        limit: query.limit,
      });
    } catch (error: any) {
      throw new BadRequestException(error?.message || 'Error listing payments');
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook handled successfully' })
  async handleWebhook(@Body() dto: HandlePaymentWebhookDto) {
    try {
      await this.handlePaymentWebhookUseCase.execute({
        paymentId: dto.paymentId,
        status: dto.status as PaymentStatus,
        providerRef: dto.providerRef,
        metadata: dto.metadata,
      });
      return { status: 'success' };
    } catch (error: any) {
      throw new BadRequestException(error?.message || 'Error processing webhook');
    }
  }

  @Post(':id/cancel')
  @Roles('USER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a payment' })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  async cancelPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId') userId: string,
    @Body('reason') reason?: string,
  ) {
    try {
      return await this.cancelPaymentUseCase.execute({
        paymentId: id,
        userId,
        reason,
      });
    } catch (error: any) {
      if (error?.message === 'Payment not found') {
        throw new NotFoundException(error.message);
      }
      if (error?.message === 'Unauthorized to cancel this payment') {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(error?.message || 'Error canceling payment');
    }
  }
} 