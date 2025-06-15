import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE } from '@core/index';

export interface ResetPasswordCommand {
  token: string;
  newPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    // Validar token y obtener userId
    const userId = await this.validateResetToken(command.token);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Buscar usuario
    const auth = await this.authRepository.findById(userId);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }

    // Hashear nueva contraseña
    const hashedPassword = await this.passwordHashingService.hash(command.newPassword);

    // Actualizar contraseña
    await this.authRepository.update(userId, {
      password: hashedPassword,
    });
  }

  private async validateResetToken(token: string): Promise<string | null> {
    // Implementar validación de token
    // Por ejemplo, verificar firma y expiración
    return 'user-id';
  }
} 