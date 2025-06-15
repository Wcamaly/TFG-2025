import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Routine } from '../../domain/entities/routine.entity';
import { IRoutineRepository } from '../../domain/repositories/routine.repository';
import { UpdateRoutineDto } from '../../infrastructure/dtos/update-routine.dto';

@Injectable()
export class UpdateRoutineUseCase {
  constructor(private readonly routineRepository: IRoutineRepository) {}

  async execute(trainerId: string, routineId: string, dto: UpdateRoutineDto): Promise<Routine> {
    const routine = await this.routineRepository.findById(routineId);
    
    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    if (routine.getTrainerId() !== trainerId) {
      throw new ForbiddenException('You can only update your own routines');
    }

    if (dto.title) routine.updateTitle(dto.title);
    if (dto.description) routine.updateDescription(dto.description);
    if (dto.difficulty) routine.updateDifficulty(dto.difficulty);
    if (dto.duration) routine.updateDuration(dto.duration);
    if (dto.language) routine.updateLanguage(dto.language);
    if (dto.tags) routine.updateTags(dto.tags);
    if (dto.isPublished !== undefined) {
      dto.isPublished ? routine.publish() : routine.unpublish();
    }

    return this.routineRepository.update(routine);
  }
} 