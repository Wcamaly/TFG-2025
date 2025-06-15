import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Routine } from '../../domain/entities/routine.entity';
import { IRoutineRepository } from '../../domain/repositories/routine.repository';

@Injectable()
export class GetRoutineUseCase {
  constructor(private readonly routineRepository: IRoutineRepository) {}

  async execute(routineId: string, userId?: string, isTrainer: boolean = false): Promise<Routine> {
    const routine = await this.routineRepository.findById(routineId);
    
    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    // Si el usuario es el entrenador, puede ver la rutina aunque no esté publicada
    if (isTrainer && routine.getTrainerId() === userId) {
      return routine;
    }

    // Si no es el entrenador, solo puede ver rutinas publicadas
    if (!routine.isPublished()) {
      throw new ForbiddenException('This routine is not published');
    }

    return routine;
  }
} 