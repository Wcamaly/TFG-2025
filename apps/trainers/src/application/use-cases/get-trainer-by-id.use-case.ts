import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerRepository } from '../../domain/repositories/trainer.repository';
import { TRAINER_REPOSITORY } from '../../infrastructure/tokens';

/**
 * Query for getting a trainer by ID
 */
export interface GetTrainerByIdQuery {
  id: string;
}

/**
 * Result of getting a trainer by ID
 */
export interface GetTrainerByIdResult {
  id: string;
  userId: string;
  bio: string | null;
  specialties: string[];
  languages: string[];
  rating: {
    value: number;
    reviewCount: number;
    category: string;
  } | null;
  pricePerSession: {
    amount: number;
    currency: string;
  } | null;
  availableTimes: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

/**
 * Use case for getting a trainer by ID
 * Implements the "Ver perfil de un entrenador" business requirement
 */
@Injectable()
export class GetTrainerByIdUseCase {
  constructor(
    @Inject(TRAINER_REPOSITORY)
    private readonly trainerRepository: TrainerRepository
  ) {}

  async execute(query: GetTrainerByIdQuery): Promise<GetTrainerByIdResult> {
    const trainer = await this.trainerRepository.findById(query.id);
    
    if (!trainer) {
      throw new NotFoundException(`Entrenador con ID ${query.id} no encontrado`);
    }

    return this.mapTrainerToResult(trainer);
  }

  private mapTrainerToResult(trainer: Trainer): GetTrainerByIdResult {
    return {
      id: trainer.id,
      userId: trainer.userId,
      bio: trainer.bio,
      specialties: trainer.specialties.map(s => s.value),
      languages: trainer.languages.map(l => l.code),
      rating: trainer.rating ? trainer.rating.toJSON() : null,
      pricePerSession: trainer.pricePerSession ? trainer.pricePerSession.toJSON() : null,
      availableTimes: trainer.availableTimes.toJSON(),
      isActive: trainer.isActive,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
      metadata: trainer.metadata
    };
  }
} 