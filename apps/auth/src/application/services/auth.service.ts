import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { PasswordService } from '../../domain/services/password.service';
import { JwtTokenService } from '@core/index';
import { RegisterUserDto } from '../../presentation/dtos/register-user.dto';
import { LoginUserDto } from '../../presentation/dtos/login-user.dto';
import { ForgotPasswordDto } from '../../presentation/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../../presentation/dtos/reset-password.dto';
import { Auth } from '../../domain/entities/auth.entity';
import { NotificationEmitter } from '@core/notifications/notification.emitter';


@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly passwordService: PasswordService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  async register(command: RegisterUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const hashedPassword = await this.passwordService.hash(command.password);
    const auth = await this.authRepository.create({
      email: command.email,
      password: hashedPassword,
      role: command.role,
    });

    const accessToken = await this.jwtTokenService.generateToken(auth);
    const refreshToken = await this.jwtTokenService.generateRefreshToken(auth);

    // Enviar notificación de bienvenida
    await this.notificationEmitter.emit({
      type: 'email',
      channel: 'user-notifications',
      template: 'welcome',
      data: {
        email: auth.email,
        name: command.name || auth.email.split('@')[0],
      }
    });

    return { accessToken, refreshToken };
  }

  async login(command: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const auth = await this.authRepository.findByEmail(command.email);
    if (!auth) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(command.password, auth.password);
    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await this.authRepository.update(auth.id, {
        failedAttempts: (auth.failedAttempts || 0) + 1,
        lastFailedAttempt: new Date(),
      });

      // Si excede el límite de intentos, bloquear la cuenta
      if ((auth.failedAttempts || 0) + 1 >= 5) {
        const unlockTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
        await this.authRepository.update(auth.id, {
          isLocked: true,
          lockExpiresAt: unlockTime,
        });

        // Enviar notificación de cuenta bloqueada
        await this.notificationEmitter.emit({
          type: 'email',
          channel: 'user-notifications',
          template: 'account-locked',
          data: {
            email: auth.email,
            unlockTime: unlockTime.toLocaleString(),
          }
        });
      }

      throw new Error('Invalid credentials');
    }

    const accessToken = await this.jwtTokenService.generateAccessToken(auth);
    const refreshToken = await this.jwtTokenService.generateRefreshToken(auth);

    await this.authRepository.update(auth.id, {
      lastLogin: new Date(),
      failedAttempts: 0,
    });

    // Enviar alerta de login
    await this.notificationEmitter.emit({
      type: 'email',
      channel: 'user-notifications',
      template: 'login-alert',
      data: {
        email: auth.email,
        location: command.ip || 'Unknown location',
        device: command.userAgent || 'Unknown device',
        timestamp: new Date().toISOString(),
      }
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(command: ForgotPasswordDto): Promise<void> {
    const auth = await this.authRepository.findByEmail(command.email);
    if (!auth) {
      return;
    }

    const resetToken = await this.jwtTokenService.generateResetToken(auth);
    
    // Enviar notificación de recuperación de contraseña
    await this.notificationEmitter.emit({
      type: 'email',
      channel: 'user-notifications',
      template: 'password-reset',
      data: {
        email: auth.email,
        resetToken,
      }
    });
  }

  async resetPassword(command: ResetPasswordDto): Promise<void> {
    const payload = await this.jwtTokenService.verifyResetToken(command.token);
    const auth = await this.authRepository.findById(payload.sub);
    if (!auth) {
      throw new Error('Invalid token');
    }

    const hashedPassword = await this.passwordService.hash(command.password);
    await this.authRepository.update(auth.id, {
      password: hashedPassword,
      failedAttempts: 0,
    });

    // Enviar notificación de cambio de contraseña
    await this.notificationEmitter.emit({
      type: 'email',
      channel: 'user-notifications',
      template: 'password-changed',
      data: {
        email: auth.email,
        timestamp: new Date().toISOString(),
      }
    });
  }

  async getMe(id: string): Promise<Auth> {
    return this.authRepository.findById(id);
  }
} 