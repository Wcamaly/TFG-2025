import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';

import { TrainerRepository } from '../../domain/repositories/trainer.repository';
import { TRAINER_REPOSITORY } from '../../infrastructure/tokens';

export interface DeleteTrainerCommand {
  trainerId: string;
  userId: string; // For authorization
}

export interface DeleteTrainerResult {
  id: string;
  message: string;
}

@Injectable()
export class DeleteTrainerUseCase {
  constructor(
    @Inject(TRAINER_REPOSITORY)
    private readonly trainerRepository: TrainerRepository
  ) {}

  async execute(command: DeleteTrainerCommand): Promise<DeleteTrainerResult> {
    const trainer = await this.trainerRepository.findById(command.trainerId);
    
    if (!trainer) {
      throw new NotFoundException(`Entrenador con ID ${command.trainerId} no encontrado`);
    }

    // Authorization: Only the trainer owner can delete their profile
    if (trainer.userId !== command.userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este perfil');
    }

    // Delete trainer
    await this.trainerRepository.delete(command.trainerId);

    return {
      id: command.trainerId,
      message: 'Perfil de entrenador eliminado exitosamente'
    };
  }
} 