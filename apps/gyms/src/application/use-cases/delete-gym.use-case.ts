import { Injectable, Inject } from '@nestjs/common';
import { GymRepository } from '../../domain/repositories/gym.repository';

export interface DeleteGymCommand {
  gymId: string;
  ownerId: string;
}

export class GymNotFoundError extends Error {
  constructor(gymId: string) {
    super(`Gym with id "${gymId}" not found`);
  }
}

export class UnauthorizedDeleteError extends Error {
  constructor() {
    super('User is not authorized to delete this gym');
  }
}

@Injectable()
export class DeleteGymUseCase {
  constructor(@Inject('GymRepository') private readonly gymRepository: GymRepository) {}

  async execute(command: DeleteGymCommand): Promise<void> {
    // Buscar el gimnasio existente
    const existingGym = await this.gymRepository.findById(command.gymId);
    if (!existingGym) {
      throw new GymNotFoundError(command.gymId);
    }

    // Verificar que el usuario es el propietario
    if (!existingGym.isOwnedBy(command.ownerId)) {
      throw new UnauthorizedDeleteError();
    }

    // Eliminar el gimnasio
    await this.gymRepository.delete(command.gymId);
  }
} 