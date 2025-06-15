import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE, JwtTokenService, JWT_TOKEN_SERVICE } from '@core/index';
import { Auth, UserRole } from '../../domain/entities/auth.entity';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserCommand {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserResult {
  auth: Auth;
  token: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    // Verificar si el usuario ya existe
    const existingAuth = await this.authRepository.findByEmail(command.email);
    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await this.passwordHashingService.hash(command.password);

    // Crear el registro de autenticación usando el factory method del dominio
    const auth = Auth.create(
      uuidv4(),
      command.email,
      hashedPassword,
      command.role || UserRole.USER,
    );

    // Guardar el registro de autenticación
    const savedAuth = await this.authRepository.save(auth);

    // Generar token JWT
    const token = await this.jwtTokenService.generateToken(savedAuth);

    // Retornar registro de autenticación y token
    return {
      auth: savedAuth,
      token,
    };
  }
} 