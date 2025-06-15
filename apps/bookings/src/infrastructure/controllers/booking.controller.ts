import { Controller, Post, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CreateBookingUseCase, CreateBookingDto } from '../../application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import { ListBookingsUseCase, ListBookingsDto } from '../../application/use-cases/list-bookings.use-case';
import { GenerateBookingQuotasUseCase, GenerateQuotasDto } from '../../application/use-cases/generate-booking-quotas.use-case';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly listBookingsUseCase: ListBookingsUseCase,
    private readonly generateQuotasUseCase: GenerateBookingQuotasUseCase,
  ) {}

  @Post()
  @Roles(UserRole.USER)
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.createBookingUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.TRAINER, UserRole.GYM_OWNER)
  async listBookings(@Query() dto: ListBookingsDto) {
    return this.listBookingsUseCase.execute(dto);
  }

  @Put(':id/cancel')
  @Roles(UserRole.USER)
  async cancelBooking(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.cancelBookingUseCase.execute(id, userId);
  }

  @Post('quotas/generate')
  @Roles(UserRole.ADMIN)
  async generateQuotas(@Body() dto: GenerateQuotasDto) {
    return this.generateQuotasUseCase.execute(dto);
  }
} 