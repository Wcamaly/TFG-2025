import { Injectable } from '@nestjs/common';
import { Routine } from '../../domain/entities/routine.entity';
import { IRoutineRepository } from '../../domain/repositories/routine.repository';
import { CreateRoutineDto } from '../../infrastructure/dtos/create-routine.dto';

@Injectable()
export class CreateRoutineUseCase {
  constructor(private readonly routineRepository: IRoutineRepository) {}

  async execute(trainerId: string, dto: CreateRoutineDto): Promise<Routine> {
    const routine = new Routine({
      trainerId,
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      duration: dto.duration,
      language: dto.language,
      tags: dto.tags,
      isPublished: dto.isPublished,
    });

    return this.routineRepository.create(routine);
  }
} 