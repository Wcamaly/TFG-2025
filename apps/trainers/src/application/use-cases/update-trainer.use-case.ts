import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';

import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerRepository } from '../../domain/repositories/trainer.repository';
import { TRAINER_REPOSITORY } from '../../infrastructure/tokens';
import { TrainerSpecialty } from '../../domain/value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../domain/value-objects/trainer-language.vo';
import { TrainerAvailability } from '../../domain/value-objects/trainer-availability.vo';
import { Money } from '../../domain/value-objects/money.vo';

export interface UpdateTrainerCommand {
  trainerId: string;
  userId: string; // For authorization
  bio?: string;
  specialties?: string[];
  languages?: string[];
  pricePerSession?: {
    amount: number;
    currency: string;
  };
  availableTimes?: any;
  metadata?: Record<string, any>;
}

export interface UpdateTrainerResult {
  id: string;
  message: string;
}

@Injectable()
export class UpdateTrainerUseCase {
  constructor(
    @Inject(TRAINER_REPOSITORY)
    private readonly trainerRepository: TrainerRepository
  ) {}

  async execute(command: UpdateTrainerCommand): Promise<UpdateTrainerResult> {
    const trainer = await this.trainerRepository.findById(command.trainerId);
    
    if (!trainer) {
      throw new NotFoundException(`Entrenador con ID ${command.trainerId} no encontrado`);
    }

    // Authorization: Only the trainer owner can update their profile
    if (trainer.userId !== command.userId) {
      throw new ForbiddenException('No tienes permisos para actualizar este perfil');
    }

    // Update bio if provided
    if (command.bio !== undefined) {
      if (command.bio.trim().length > 0) {
        trainer.updateBio(command.bio.trim());
      }
    }

    // Update specialties if provided
    if (command.specialties !== undefined) {
      // Remove all current specialties
      trainer.specialties.forEach(specialty => {
        trainer.removeSpecialty(specialty);
      });

      // Add new specialties
      command.specialties.forEach(specialtyStr => {
        if (specialtyStr.trim().length > 0) {
          const specialty = TrainerSpecialty.create(specialtyStr);
          trainer.addSpecialty(specialty);
        }
      });
    }

    // Update languages if provided
    if (command.languages !== undefined && command.languages.length > 0) {
      // Remove all current languages
      trainer.languages.forEach(language => {
        if (trainer.languages.length > 1) { // Keep at least one language
          trainer.removeLanguage(language);
        }
      });

      // Add new languages
      command.languages.forEach(languageStr => {
        if (languageStr.trim().length > 0) {
          const language = TrainerLanguage.create(languageStr);
          trainer.addLanguage(language);
        }
      });
    }

    // Update price if provided
    if (command.pricePerSession) {
      const price = Money.create(command.pricePerSession.amount, command.pricePerSession.currency);
      trainer.updatePricePerSession(price);
    }

    // Update availability if provided
    if (command.availableTimes) {
      const availability = TrainerAvailability.create(command.availableTimes);
      trainer.updateAvailability(availability);
    }

    // Save updated trainer
    await this.trainerRepository.save(trainer);

    return {
      id: command.trainerId,
      message: 'Perfil de entrenador actualizado exitosamente'
    };
  }
} 