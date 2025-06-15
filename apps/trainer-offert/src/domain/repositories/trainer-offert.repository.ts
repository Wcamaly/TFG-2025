import { TrainerOffert } from '../entities/trainer-offert.entity';

export const TRAINER_OFFERT_REPOSITORY = Symbol('TRAINER_OFFERT_REPOSITORY');

export interface ITrainerOffertRepository {
  create(offert: TrainerOffert): Promise<TrainerOffert>;
  findById(id: string): Promise<TrainerOffert | null>;
  findByTrainerId(trainerId: string): Promise<TrainerOffert[]>;
  findActiveByTrainerId(trainerId: string): Promise<TrainerOffert[]>;
  update(offert: TrainerOffert): Promise<TrainerOffert>;
  delete(id: string): Promise<void>;
} 