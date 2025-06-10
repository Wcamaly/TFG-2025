import { Injectable } from '@nestjs/common';

import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerRepository, TrainerSearchFilters, TrainerSearchResult } from '../../domain/repositories/trainer.repository';
import { TrainerSpecialty } from '../../domain/value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../domain/value-objects/trainer-language.vo';
import { Money } from '../../domain/value-objects/money.vo';

/**
 * Temporary in-memory implementation of TrainerRepository
 * This will be replaced with PrismaTrainerRepository once Prisma types are resolved
 */
@Injectable()
export class MemoryTrainerRepository implements TrainerRepository {
  private trainers: Map<string, Trainer> = new Map();
  private userIdToTrainerId: Map<string, string> = new Map();

  async findById(id: string): Promise<Trainer | null> {
    return this.trainers.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Trainer | null> {
    const trainerId = this.userIdToTrainerId.get(userId);
    if (!trainerId) return null;
    return this.trainers.get(trainerId) || null;
  }

  async findByFilters(filters: TrainerSearchFilters): Promise<TrainerSearchResult> {
    let filteredTrainers = Array.from(this.trainers.values());

    // Apply filters
    if (filters.isActive !== undefined) {
      filteredTrainers = filteredTrainers.filter(trainer => trainer.isActive === filters.isActive);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTrainers = filteredTrainers.filter(trainer => 
        trainer.bio?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.specialties && filters.specialties.length > 0) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        filters.specialties!.some(specialty => trainer.hasSpecialty(specialty))
      );
    }

    if (filters.languages && filters.languages.length > 0) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        filters.languages!.some(language => trainer.speaksLanguage(language))
      );
    }

    if (filters.minPrice) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.pricePerSession && trainer.pricePerSession.amount >= filters.minPrice!.amount
      );
    }

    if (filters.maxPrice) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.pricePerSession && trainer.pricePerSession.amount <= filters.maxPrice!.amount
      );
    }

    if (filters.minimumRating) {
      filteredTrainers = filteredTrainers.filter(trainer =>
        trainer.rating && trainer.rating.value >= filters.minimumRating!
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredTrainers.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'rating':
            const aRating = a.rating?.value || 0;
            const bRating = b.rating?.value || 0;
            comparison = aRating - bRating;
            break;
          case 'price':
            const aPrice = a.pricePerSession?.amount || 0;
            const bPrice = b.pricePerSession?.amount || 0;
            comparison = aPrice - bPrice;
            break;
          case 'createdAt':
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          default:
            comparison = 0;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;
    const total = filteredTrainers.length;
    const paginatedTrainers = filteredTrainers.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      trainers: paginatedTrainers,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  async save(trainer: Trainer): Promise<void> {
    this.trainers.set(trainer.id, trainer);
    this.userIdToTrainerId.set(trainer.userId, trainer.id);
  }

  async delete(id: string): Promise<void> {
    const trainer = this.trainers.get(id);
    if (trainer) {
      this.trainers.delete(id);
      this.userIdToTrainerId.delete(trainer.userId);
    }
  }

  async existsByUserId(userId: string): Promise<boolean> {
    return this.userIdToTrainerId.has(userId);
  }

  async findBySpecialty(specialty: TrainerSpecialty): Promise<Trainer[]> {
    return Array.from(this.trainers.values()).filter(trainer =>
      trainer.isActive && trainer.hasSpecialty(specialty)
    );
  }

  async findByLanguage(language: TrainerLanguage): Promise<Trainer[]> {
    return Array.from(this.trainers.values()).filter(trainer =>
      trainer.isActive && trainer.speaksLanguage(language)
    );
  }

  async findByPriceRange(minPrice: Money, maxPrice: Money): Promise<Trainer[]> {
    return Array.from(this.trainers.values()).filter(trainer =>
      trainer.isActive && 
      trainer.pricePerSession &&
      trainer.pricePerSession.amount >= minPrice.amount &&
      trainer.pricePerSession.amount <= maxPrice.amount
    );
  }

  async findByMinimumRating(minimumRating: number): Promise<Trainer[]> {
    return Array.from(this.trainers.values()).filter(trainer =>
      trainer.isActive && 
      trainer.rating &&
      trainer.rating.value >= minimumRating
    );
  }

  async countActive(): Promise<number> {
    return Array.from(this.trainers.values()).filter(trainer => trainer.isActive).length;
  }

  // Helper methods for testing
  clear(): void {
    this.trainers.clear();
    this.userIdToTrainerId.clear();
  }

  getAll(): Trainer[] {
    return Array.from(this.trainers.values());
  }
} 