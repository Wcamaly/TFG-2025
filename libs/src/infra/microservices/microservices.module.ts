import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroservicesService } from './microservices.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MicroservicesService],
  exports: [MicroservicesService],
})
export class MicroservicesModule {} 