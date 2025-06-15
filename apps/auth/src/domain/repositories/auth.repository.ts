import { Auth } from '../entities/auth.entity';

export interface AuthRepository {
  findById(id: string): Promise<Auth | null>;
  findByEmail(email: string): Promise<Auth | null>;
  create(data: Partial<Auth>): Promise<Auth>;
  update(id: string, data: Partial<Auth>): Promise<Auth>;
  delete(id: string): Promise<void>;
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY'); 