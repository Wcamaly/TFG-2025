import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Gym, GymLocation, OpeningHours } from '../../domain/entities/gym.entity';
import { GymRepository } from '../../domain/repositories/gym.repository';

export interface CreateGymCommand {
  name: string;
  description: string;
  address: string;
  location: GymLocation;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  ownerId: string;
}

export class GymAlreadyExistsError extends Error {
  constructor(name: string, location: GymLocation) {
    super(`Gym with name "${name}" already exists in location ${location.latitude}, ${location.longitude}`);
  }
}

export class UnauthorizedOwnerError extends Error {
  constructor() {
    super('User is not authorized to create a gym');
  }
}

@Injectable()
export class CreateGymUseCase {
  constructor(@Inject('GymRepository') private readonly gymRepository: GymRepository) {}

  async execute(command: CreateGymCommand): Promise<Gym> {
    // Validar que no existe otro gimnasio con el mismo nombre en la misma ubicación (radio de 1km)
    const existsInLocation = await this.gymRepository.existsByNameAndLocation(
      command.name,
      command.location.latitude,
      command.location.longitude,
      1 // 1km radius
    );

    if (existsInLocation) {
      throw new GymAlreadyExistsError(command.name, command.location);
    }

    // Crear el gimnasio
    const gym = Gym.create({
      id: uuidv4(),
      name: command.name,
      description: command.description,
      address: command.address,
      location: command.location,
      phone: command.phone,
      email: command.email,
      openingHours: command.openingHours,
      ownerId: command.ownerId,
    });

    // Persistir en el repositorio
    return await this.gymRepository.save(gym);
  }
} 