import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE, JwtTokenService, JWT_TOKEN_SERVICE } from '@core/index';

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  token: string;
  refreshToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    // Buscar usuario por email
    const auth = await this.authRepository.findByEmail(command.email);
    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await this.passwordHashingService.compare(
      command.password,
      auth.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Actualizar último login
    auth.updateLastLogin();
    await this.authRepository.update(auth);

    // Generar tokens
    const token = await this.jwtTokenService.generateToken(auth);
    const refreshToken = await this.jwtTokenService.generateRefreshToken(auth);

    return {
      token,
      refreshToken,
    };
  }
} 