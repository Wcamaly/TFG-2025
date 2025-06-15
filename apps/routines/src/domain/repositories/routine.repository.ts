import { Routine } from '../entities/routine.entity';

export interface IRoutineRepository {
  create(routine: Routine): Promise<Routine>;
  findById(id: string): Promise<Routine | null>;
  findByTrainerId(trainerId: string): Promise<Routine[]>;
  findPublishedByTrainerId(trainerId: string): Promise<Routine[]>;
  update(routine: Routine): Promise<Routine>;
  delete(id: string): Promise<void>;
} 