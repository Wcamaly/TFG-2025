import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationIdMiddleware } from '../../../libs/src/core/middleware/correlation-id.middleware';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class AuthModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
} 