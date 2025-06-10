import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerRepository } from '../../domain/repositories/trainer.repository';
import { TRAINER_REPOSITORY } from '../../infrastructure/tokens';
import { TrainerSpecialty } from '../../domain/value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../domain/value-objects/trainer-language.vo';
import { TrainerAvailability } from '../../domain/value-objects/trainer-availability.vo';
import { Money } from '../../domain/value-objects/money.vo';

/**
 * DTO for creating a trainer
 */
export interface CreateTrainerCommand {
  userId: string;
  bio?: string;
  specialties: string[];
  languages: string[];
  pricePerSession?: {
    amount: number;
    currency: string;
  };
  availableTimes?: any; // WeeklyAvailability structure
  metadata?: Record<string, any>;
}

/**
 * Result of creating a trainer
 */
export interface CreateTrainerResult {
  id: string;
  userId: string;
  message: string;
}

/**
 * Use case for creating a trainer profile
 * Implements the "Registrarse como entrenador" business requirement
 */
@Injectable()
export class CreateTrainerUseCase {
  constructor(
    @Inject(TRAINER_REPOSITORY)
    private readonly trainerRepository: TrainerRepository
  ) {}

  async execute(command: CreateTrainerCommand): Promise<CreateTrainerResult> {
    // Business rule: Check if user already has a trainer profile
    await this.validateUserDoesNotHaveTrainerProfile(command.userId);

    // Validate and create value objects
    const specialties = this.createSpecialties(command.specialties);
    const languages = this.createLanguages(command.languages);
    const pricePerSession = command.pricePerSession 
      ? Money.create(command.pricePerSession.amount, command.pricePerSession.currency)
      : null;
    const availableTimes = command.availableTimes 
      ? TrainerAvailability.create(command.availableTimes)
      : TrainerAvailability.create({});

    // Business rule validation: At least one language is required
    if (languages.length === 0) {
      throw new Error('Al menos un idioma es requerido');
    }

    // Create trainer entity
    const trainerId = uuidv4();
    const trainer = Trainer.create(
      trainerId,
      command.userId,
      command.bio || null,
      specialties,
      languages,
      pricePerSession,
      availableTimes,
      command.metadata || {}
    );

    // Save trainer
    await this.trainerRepository.save(trainer);

    return {
      id: trainerId,
      userId: command.userId,
      message: 'Perfil de entrenador creado exitosamente'
    };
  }

  private async validateUserDoesNotHaveTrainerProfile(userId: string): Promise<void> {
    const existingTrainer = await this.trainerRepository.findByUserId(userId);
    if (existingTrainer) {
      throw new ConflictException('El usuario ya tiene un perfil de entrenador');
    }
  }

  private createSpecialties(specialtyStrings: string[]): TrainerSpecialty[] {
    if (!Array.isArray(specialtyStrings)) {
      return [];
    }

    return specialtyStrings
      .filter(s => s && s.trim().length > 0)
      .map(specialty => {
        try {
          return TrainerSpecialty.create(specialty);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido';
          throw new Error(`Especialidad inválida: ${specialty}. ${message}`);
        }
      });
  }

  private createLanguages(languageStrings: string[]): TrainerLanguage[] {
    if (!Array.isArray(languageStrings)) {
      throw new Error('Los idiomas deben ser proporcionados como un array');
    }

    if (languageStrings.length === 0) {
      throw new Error('Al menos un idioma es requerido');
    }

    return languageStrings
      .filter(l => l && l.trim().length > 0)
      .map(language => {
        try {
          return TrainerLanguage.create(language);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido';
          throw new Error(`Idioma inválido: ${language}. ${message}`);
        }
      });
  }
} 