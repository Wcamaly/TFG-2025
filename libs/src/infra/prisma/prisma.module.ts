import { Global, Module, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'PRISMA_SERVICE',
      useExisting: PrismaService,
    },
  ],
  exports: [PrismaService, 'PRISMA_SERVICE'],
})
export class PrismaModule {
  private readonly logger = new Logger(PrismaModule.name);

  constructor() {
    this.logger.log('PrismaModule initialized');
  }
} 