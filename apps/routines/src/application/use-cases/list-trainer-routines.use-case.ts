import { Injectable } from '@nestjs/common';
import { Routine } from '../../domain/entities/routine.entity';
import { IRoutineRepository } from '../../domain/repositories/routine.repository';

@Injectable()
export class ListTrainerRoutinesUseCase {
  constructor(private readonly routineRepository: IRoutineRepository) {}

  async execute(trainerId: string, includeUnpublished: boolean = false): Promise<Routine[]> {
    if (includeUnpublished) {
      return this.routineRepository.findByTrainerId(trainerId);
    }
    return this.routineRepository.findPublishedByTrainerId(trainerId);
  }
} 