import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { SwaggerMergerService } from './swagger/swagger-merger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [SwaggerMergerService],
})
export class ApiGatewayModule {} 