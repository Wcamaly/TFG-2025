import { Inject, Injectable } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';
import { PasswordRecoveryService, PASSWORD_RECOVERY_SERVICE } from '@core/index';

export interface ForgotPasswordCommand {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_RECOVERY_SERVICE)
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    
    // Política de seguridad: no revelar si el email existe o no
    if (!user) {
      return;
    }

    const token = this.passwordRecoveryService.generateToken(user.email);
    
    // TODO: Enviar email con el token
    console.log(`Password reset token for ${user.email}: ${token}`);
  }
} 