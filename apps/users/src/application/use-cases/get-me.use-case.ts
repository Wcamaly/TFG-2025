import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '@/apps/users/src/domain/repositories/user.repository';
import { User } from '@/apps/users/src/domain/entities/user.entity';

export interface GetMeCommand {
  userId: string;
}

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetMeCommand): Promise<User> {
    // Buscar el usuario por ID
    const user = await this.userRepository.findById(command.userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new NotFoundException('User account is deactivated');
    }

    // Retornar la entidad de dominio
    return user;
  }
} 