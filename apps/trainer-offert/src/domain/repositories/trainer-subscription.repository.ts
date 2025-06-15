import { TrainerSubscription } from '../entities/trainer-subscription.entity';

export const TRAINER_SUBSCRIPTION_REPOSITORY = Symbol('TRAINER_SUBSCRIPTION_REPOSITORY');

export interface ITrainerSubscriptionRepository {
  create(subscription: TrainerSubscription): Promise<TrainerSubscription>;
  findById(id: string): Promise<TrainerSubscription | null>;
  findByUserId(userId: string): Promise<TrainerSubscription[]>;
  findActiveByUserId(userId: string): Promise<TrainerSubscription[]>;
  findByOffertId(offertId: string): Promise<TrainerSubscription[]>;
  findByPaymentId(paymentId: string): Promise<TrainerSubscription[]>;
  update(subscription: TrainerSubscription): Promise<TrainerSubscription>;
  delete(id: string): Promise<void>;
} 