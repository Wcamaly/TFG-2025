import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis';
import { MicroservicesModule } from './microservices/microservices.module';

@Module({
  imports: [PrismaModule, RedisModule, MicroservicesModule],
  exports: [PrismaModule, RedisModule, MicroservicesModule],
})
export class InfraModule {} 