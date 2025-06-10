import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE, JwtTokenService, JWT_TOKEN_SERVICE } from '@core/index';
import { User, UserRole } from '@/apps/users/src/domain/entities/user.entity';

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  user: User;
  token: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    // Buscar el usuario por email
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar si el usuario puede hacer login (regla de negocio)
    if (!user.canLogin()) {
      if (user.isLocked) {
        throw new UnauthorizedException('Account is locked due to multiple failed attempts');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }
    }

    // Verificar la contraseña
    const isValidPassword = await this.passwordHashingService.compare(
      command.password,
      user.password
    );

    if (!isValidPassword) {
      // Incrementar intentos fallidos usando método de dominio
      user.incrementFailedAttempts();
      
      // Si debe bloquearse, bloquearlo
      if (user.shouldBeLocked()) {
        user.lockAccount();
      }
      
      // Guardar los cambios
      await this.userRepository.save(user);
      
      throw new UnauthorizedException('Invalid credentials');
    }

    // Login exitoso: resetear intentos fallidos y actualizar último login
    user.resetFailedAttempts();
    user.updateLastLogin();
    const updatedUser = await this.userRepository.save(user);

    // Generar token JWT
    const token = await this.jwtTokenService.generateToken(updatedUser);

    // Retornar usuario y token
    return {
      user: updatedUser,
      token,
    };
  }
} 