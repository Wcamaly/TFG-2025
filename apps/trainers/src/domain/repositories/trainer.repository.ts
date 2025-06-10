import { Trainer } from '../entities/trainer.entity';
import { TrainerSpecialty } from '../value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../value-objects/trainer-language.vo';
import { Money } from '../value-objects/money.vo';

/**
 * Domain repository interface for Trainer aggregate
 * Following DDD principles and Port-Adapter pattern
 */
export interface TrainerRepository {
  /**
   * Find a trainer by their ID
   */
  findById(id: string): Promise<Trainer | null>;

  /**
   * Find a trainer by their user ID
   */
  findByUserId(userId: string): Promise<Trainer | null>;

  /**
   * Find trainers by multiple filters
   */
  findByFilters(filters: TrainerSearchFilters): Promise<TrainerSearchResult>;

  /**
   * Save a trainer (create or update)
   */
  save(trainer: Trainer): Promise<void>;

  /**
   * Delete a trainer by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a trainer exists by user ID
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Find trainers by specialty
   */
  findBySpecialty(specialty: TrainerSpecialty): Promise<Trainer[]>;

  /**
   * Find trainers by language
   */
  findByLanguage(language: TrainerLanguage): Promise<Trainer[]>;

  /**
   * Find trainers by price range
   */
  findByPriceRange(minPrice: Money, maxPrice: Money): Promise<Trainer[]>;

  /**
   * Find trainers with minimum rating
   */
  findByMinimumRating(minimumRating: number): Promise<Trainer[]>;

  /**
   * Get total count of active trainers
   */
  countActive(): Promise<number>;
}

/**
 * Search filters for trainers
 */
export interface TrainerSearchFilters {
  /** Search by name or bio keywords */
  search?: string;

  /** Filter by specialties */
  specialties?: TrainerSpecialty[];

  /** Filter by languages */
  languages?: TrainerLanguage[];

  /** Filter by price range */
  minPrice?: Money;
  maxPrice?: Money;

  /** Filter by minimum rating */
  minimumRating?: number;

  /** Filter by availability on specific day */
  availableOnDay?: string; // Format: YYYY-MM-DD

  /** Filter by availability at specific time */
  availableAt?: Date;

  /** Filter by active status */
  isActive?: boolean;

  /** Pagination */
  page?: number;
  limit?: number;

  /** Sorting */
  sortBy?: 'rating' | 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';

  /** Geolocation filters (future implementation) */
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

/**
 * Search result with pagination
 */
export interface TrainerSearchResult {
  trainers: Trainer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
} 