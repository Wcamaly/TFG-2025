import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationIdMiddleware } from '@core/middleware/correlation-id.middleware';
import { BookingController } from './infrastructure/controllers/booking.controller';
import { CreateBookingUseCase } from './application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from './application/use-cases/cancel-booking.use-case';
import { ListBookingsUseCase } from './application/use-cases/list-bookings.use-case';
import { GenerateBookingQuotasUseCase } from './application/use-cases/generate-booking-quotas.use-case';
import { PrismaBookingRepository } from './infrastructure/repositories/prisma-booking.repository';
import { PrismaBookingQuotaRepository } from './infrastructure/repositories/prisma-booking-quota.repository';
import { BOOKING_REPOSITORY } from './domain/repositories/booking.repository';
import { BOOKING_QUOTA_REPOSITORY } from './domain/repositories/booking-quota.repository';

@Module({
  imports: [],
  controllers: [BookingController],
  providers: [
    CreateBookingUseCase,
    CancelBookingUseCase,
    ListBookingsUseCase,
    GenerateBookingQuotasUseCase,
    {
      provide: BOOKING_REPOSITORY,
      useClass: PrismaBookingRepository,
    },
    {
      provide: BOOKING_QUOTA_REPOSITORY,
      useClass: PrismaBookingQuotaRepository,
    },
  ],
  exports: [
    CreateBookingUseCase,
    CancelBookingUseCase,
    ListBookingsUseCase,
    GenerateBookingQuotasUseCase,
  ],
})
export class BookingsModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 