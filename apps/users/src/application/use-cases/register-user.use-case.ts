import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';
import { PasswordHashingService, PASSWORD_HASHING_SERVICE, JwtTokenService, JWT_TOKEN_SERVICE } from '@core/index';
import { User, UserRole } from '@/apps/users/src/domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserCommand {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface RegisterUserResult {
  user: User;
  token: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: PasswordHashingService,
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await this.passwordHashingService.hash(command.password);

    // Crear el usuario usando el factory method del dominio
    const user = User.create(
      uuidv4(),
      command.email,
      command.name,
      hashedPassword,
      command.role || UserRole.USER,
    );

    // Guardar el usuario
    const savedUser = await this.userRepository.save(user);

    // Generar token JWT
    const token = await this.jwtTokenService.generateToken(savedUser);

    // Retornar usuario y token
    return {
      user: savedUser,
      token,
    };
  }
} 