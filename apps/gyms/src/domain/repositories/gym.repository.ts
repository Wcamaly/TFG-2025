import { Gym } from '../entities/gym.entity';

export interface GymFilters {
  latitude?: number;
  longitude?: number;
  maxDistance?: number; // in kilometers
  name?: string;
  ownerId?: string;
}

export interface GymRepository {
  findById(id: string): Promise<Gym | null>;
  findByName(name: string): Promise<Gym | null>;
  findByLocation(latitude: number, longitude: number, maxDistance: number): Promise<Gym[]>;
  findByFilters(filters: GymFilters): Promise<Gym[]>;
  findByOwnerId(ownerId: string): Promise<Gym[]>;
  save(gym: Gym): Promise<Gym>;
  update(id: string, gym: Gym): Promise<Gym>;
  delete(id: string): Promise<void>;
  existsByNameAndLocation(name: string, latitude: number, longitude: number, radiusKm?: number): Promise<boolean>;
} 