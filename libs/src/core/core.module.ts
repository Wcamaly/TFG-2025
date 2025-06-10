import { Module, Global } from '@nestjs/common';
import { BcryptPasswordHashingService } from './services/bcrypt-password-hashing.service';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    BcryptPasswordHashingService,
  ],
  exports: [
    BcryptPasswordHashingService,
    AuthModule,
  ],
})
export class CoreModule {} 