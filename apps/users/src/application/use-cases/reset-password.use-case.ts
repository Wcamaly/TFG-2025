import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';
import { PasswordRecoveryService, PASSWORD_RECOVERY_SERVICE } from '@core/index';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE } from '@core/index';

export interface ResetPasswordCommand {
  token: string;
  newPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_RECOVERY_SERVICE)
    private readonly passwordRecoveryService: PasswordRecoveryService,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const email = this.passwordRecoveryService.validateToken(command.token);

    if (!email) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await this.passwordHashingService.hash(command.newPassword);
    
    // Usar el método de dominio para cambiar la contraseña
    user.changePassword(hashedPassword);

    await this.userRepository.save(user);

    // Invalidar el token después de usarlo
    this.passwordRecoveryService.invalidateToken(command.token);
  }
} 