import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { SwaggerMergerService } from './swagger/swagger-merger.service';
import { InfraModule } from '@infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InfraModule
  ],
  controllers: [ApiGatewayController],
  providers: [SwaggerMergerService],
})
export class ApiGatewayModule {} 