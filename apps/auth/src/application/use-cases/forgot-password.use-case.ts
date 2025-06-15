import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';
import { EmailService, EMAIL_SERVICE } from '@core/index';

export interface ForgotPasswordCommand {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    // Buscar usuario por email
    const auth = await this.authRepository.findByEmail(command.email);
    if (!auth) {
      // Por seguridad, no revelamos si el email existe o no
      return;
    }

    // Generar token de recuperación
    const resetToken = await this.generateResetToken(auth.id);

    // Enviar email con instrucciones
    await this.emailService.sendPasswordResetEmail(
      auth.email,
      resetToken,
    );
  }

  private async generateResetToken(userId: string): Promise<string> {
    // Implementar generación de token seguro
    // Por ejemplo, usando crypto.randomBytes
    return 'reset-token';
  }
} 