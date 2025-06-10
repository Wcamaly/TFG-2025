import { Injectable, Inject } from '@nestjs/common';

import { TrainerRepository, TrainerSearchFilters, TrainerSearchResult } from '../../domain/repositories/trainer.repository';
import { TRAINER_REPOSITORY } from '../../infrastructure/tokens';
import { TrainerSpecialty } from '../../domain/value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../domain/value-objects/trainer-language.vo';
import { Money } from '../../domain/value-objects/money.vo';

/**
 * Query for searching trainers
 */
export interface SearchTrainersQuery {
  search?: string;
  specialties?: string[];
  languages?: string[];
  minPrice?: { amount: number; currency: string };
  maxPrice?: { amount: number; currency: string };
  minimumRating?: number;
  availableOnDay?: string; // Format: YYYY-MM-DD
  availableAt?: Date;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

/**
 * Result of searching trainers
 */
export interface SearchTrainersResult {
  trainers: Array<{
    id: string;
    userId: string;
    bio: string | null;
    specialties: string[];
    languages: string[];
    rating: {
      value: number;
      reviewCount: number;
      category: string;
    } | null;
    pricePerSession: {
      amount: number;
      currency: string;
    } | null;
    availableTimes: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Use case for searching trainers with filters
 * Implements the "Buscar entrenadores por filtros" business requirement
 */
@Injectable()
export class SearchTrainersUseCase {
  constructor(
    @Inject(TRAINER_REPOSITORY)
    private readonly trainerRepository: TrainerRepository
  ) {}

  async execute(query: SearchTrainersQuery): Promise<SearchTrainersResult> {
    // Validate and create filters
    const filters = await this.createFilters(query);

    // Execute search
    const searchResult = await this.trainerRepository.findByFilters(filters);

    // Map results
    return this.mapSearchResult(searchResult);
  }

  private async createFilters(query: SearchTrainersQuery): Promise<TrainerSearchFilters> {
    const filters: TrainerSearchFilters = {
      search: query.search,
      isActive: query.isActive ?? true, // Default to active trainers only
      page: query.page ?? 1,
      limit: Math.min(query.limit ?? 20, 100), // Max 100 per page
      sortBy: query.sortBy ?? 'rating',
      sortOrder: query.sortOrder ?? 'desc'
    };

    // Process specialties
    if (query.specialties && query.specialties.length > 0) {
      filters.specialties = query.specialties
        .map(specialty => {
          try {
            return TrainerSpecialty.create(specialty);
          } catch (error) {
            // Skip invalid specialties rather than throwing
            return null;
          }
        })
        .filter((s): s is TrainerSpecialty => s !== null);
    }

    // Process languages
    if (query.languages && query.languages.length > 0) {
      filters.languages = query.languages
        .map(language => {
          try {
            return TrainerLanguage.create(language);
          } catch (error) {
            // Skip invalid languages rather than throwing
            return null;
          }
        })
        .filter((l): l is TrainerLanguage => l !== null);
    }

    // Process price filters
    if (query.minPrice) {
      try {
        filters.minPrice = Money.create(query.minPrice.amount, query.minPrice.currency);
      } catch (error) {
        // Skip invalid price
      }
    }

    if (query.maxPrice) {
      try {
        filters.maxPrice = Money.create(query.maxPrice.amount, query.maxPrice.currency);
      } catch (error) {
        // Skip invalid price
      }
    }

    // Process rating filter
    if (query.minimumRating !== undefined) {
      if (query.minimumRating >= 1 && query.minimumRating <= 5) {
        filters.minimumRating = query.minimumRating;
      }
    }

    // Process availability filters
    if (query.availableOnDay) {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(query.availableOnDay)) {
        filters.availableOnDay = query.availableOnDay;
      }
    }

    if (query.availableAt) {
      filters.availableAt = query.availableAt;
    }

    // Process geolocation filters
    if (query.latitude !== undefined && query.longitude !== undefined) {
      if (this.isValidLatitude(query.latitude) && this.isValidLongitude(query.longitude)) {
        filters.latitude = query.latitude;
        filters.longitude = query.longitude;
        filters.radiusKm = Math.max(1, Math.min(query.radiusKm ?? 10, 100)); // Between 1-100 km
      }
    }

    return filters;
  }

  private mapSearchResult(searchResult: TrainerSearchResult): SearchTrainersResult {
    return {
      trainers: searchResult.trainers.map(trainer => ({
        id: trainer.id,
        userId: trainer.userId,
        bio: trainer.bio,
        specialties: trainer.specialties.map(s => s.value),
        languages: trainer.languages.map(l => l.code),
        rating: trainer.rating ? trainer.rating.toJSON() : null,
        pricePerSession: trainer.pricePerSession ? trainer.pricePerSession.toJSON() : null,
        availableTimes: trainer.availableTimes.toJSON(),
        isActive: trainer.isActive,
        createdAt: trainer.createdAt,
        updatedAt: trainer.updatedAt
      })),
      total: searchResult.total,
      page: searchResult.page,
      limit: searchResult.limit,
      totalPages: searchResult.totalPages,
      hasNext: searchResult.hasNext,
      hasPrevious: searchResult.hasPrevious
    };
  }

  private isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  private isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
  }
} 