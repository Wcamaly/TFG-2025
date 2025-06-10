import { Injectable, Inject } from '@nestjs/common';
import { Gym } from '../../domain/entities/gym.entity';
import { GymRepository } from '../../domain/repositories/gym.repository';

export interface GetGymDetailsQuery {
  gymId: string;
}

export class GymNotFoundError extends Error {
  constructor(gymId: string) {
    super(`Gym with id "${gymId}" not found`);
  }
}

@Injectable()
export class GetGymDetailsUseCase {
  constructor(@Inject('GymRepository') private readonly gymRepository: GymRepository) {}

  async execute(query: GetGymDetailsQuery): Promise<Gym> {
    const gym = await this.gymRepository.findById(query.gymId);
    
    if (!gym) {
      throw new GymNotFoundError(query.gymId);
    }

    return gym;
  }
} 