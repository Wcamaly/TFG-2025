import { Injectable, Inject } from '@nestjs/common';
import { Gym, GymLocation, OpeningHours } from '../../domain/entities/gym.entity';
import { GymRepository } from '../../domain/repositories/gym.repository';

export interface UpdateGymCommand {
  gymId: string;
  ownerId: string;
  name?: string;
  description?: string;
  address?: string;
  location?: GymLocation;
  phone?: string;
  email?: string;
  openingHours?: OpeningHours;
}

export class GymNotFoundError extends Error {
  constructor(gymId: string) {
    super(`Gym with id "${gymId}" not found`);
  }
}

export class UnauthorizedUpdateError extends Error {
  constructor() {
    super('User is not authorized to update this gym');
  }
}

@Injectable()
export class UpdateGymUseCase {
  constructor(@Inject('GymRepository') private readonly gymRepository: GymRepository) {}

  async execute(command: UpdateGymCommand): Promise<Gym> {
    // Buscar el gimnasio existente
    const existingGym = await this.gymRepository.findById(command.gymId);
    if (!existingGym) {
      throw new GymNotFoundError(command.gymId);
    }

    // Verificar que el usuario es el propietario
    if (!existingGym.isOwnedBy(command.ownerId)) {
      throw new UnauthorizedUpdateError();
    }

    // Actualizar el gimnasio
    const updatedGym = existingGym.update({
      name: command.name,
      description: command.description,
      address: command.address,
      location: command.location,
      phone: command.phone,
      email: command.email,
      openingHours: command.openingHours,
    });

    // Persistir los cambios
    return await this.gymRepository.update(command.gymId, updatedGym);
  }
} 