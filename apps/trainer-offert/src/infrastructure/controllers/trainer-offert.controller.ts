import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateTrainerOffertUseCase } from '../../application/use-cases/create-trainer-offert.use-case';
import { CreateSubscriptionFromPaymentUseCase } from '../../application/use-cases/create-subscription-from-payment.use-case';
import { ListTrainerOffertsUseCase } from '../../application/use-cases/list-trainer-offerts.use-case';
import { ListUserSubscriptionsUseCase } from '../../application/use-cases/list-user-subscriptions.use-case';
import { CreateTrainerOffertDto } from '../dtos/create-trainer-offert.dto';
import { CreateSubscriptionFromPaymentDto } from '../dtos/create-subscription-from-payment.dto';
import { ListTrainerOffertsDto } from '../dtos/list-trainer-offerts.dto';
import { ListUserSubscriptionsDto } from '../dtos/list-user-subscriptions.dto';

@ApiTags('Trainer Offerts')
@Controller('trainer-offerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainerOffertController {
  constructor(
    private readonly createTrainerOffertUseCase: CreateTrainerOffertUseCase,
    private readonly createSubscriptionFromPaymentUseCase: CreateSubscriptionFromPaymentUseCase,
    private readonly listTrainerOffertsUseCase: ListTrainerOffertsUseCase,
    private readonly listUserSubscriptionsUseCase: ListUserSubscriptionsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.TRAINER)
  @ApiOperation({ summary: 'Create a new trainer offert' })
  @ApiResponse({ status: 201, description: 'The offert has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createOffert(@Body() dto: CreateTrainerOffertDto) {
    return this.createTrainerOffertUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.TRAINER)
  @ApiOperation({ summary: 'List trainer offerts' })
  @ApiResponse({ status: 200, description: 'Return the list of offerts.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async listOfferts(@Query() dto: ListTrainerOffertsDto) {
    return this.listTrainerOffertsUseCase.execute(dto);
  }

  @Get('subscriptions')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'List user subscriptions' })
  @ApiResponse({ status: 200, description: 'Return the list of subscriptions.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async listSubscriptions(@Query() dto: ListUserSubscriptionsDto) {
    return this.listUserSubscriptionsUseCase.execute(dto);
  }

  @Post('subscriptions')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a subscription from a payment' })
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createSubscriptionFromPayment(@Body() dto: CreateSubscriptionFromPaymentDto) {
    return this.createSubscriptionFromPaymentUseCase.execute(dto);
  }
} 