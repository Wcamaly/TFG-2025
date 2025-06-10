import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/src/infra/prisma/prisma.service';

import { Trainer } from '../../domain/entities/trainer.entity';
import { TrainerRepository, TrainerSearchFilters, TrainerSearchResult } from '../../domain/repositories/trainer.repository';
import { TrainerSpecialty } from '../../domain/value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../../domain/value-objects/trainer-language.vo';
import { TrainerAvailability } from '../../domain/value-objects/trainer-availability.vo';
import { TrainerRating } from '../../domain/value-objects/trainer-rating.vo';
import { Money } from '../../domain/value-objects/money.vo';

@Injectable()
export class PrismaTrainerRepository implements TrainerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Trainer | null> {
    const trainerData = await this.prisma.trainer.findUnique({
      where: { id }
    });

    if (!trainerData) {
      return null;
    }

    return this.mapToDomain(trainerData);
  }

  async findByUserId(userId: string): Promise<Trainer | null> {
    const trainerData = await this.prisma.trainer.findUnique({
      where: { userId }
    });

    if (!trainerData) {
      return null;
    }

    return this.mapToDomain(trainerData);
  }

  async findByFilters(filters: TrainerSearchFilters): Promise<TrainerSearchResult> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: filters.isActive ?? true
    };

    // Search in bio
    if (filters.search) {
      where.bio = {
        contains: filters.search,
        mode: 'insensitive'
      };
    }

    // Filter by minimum rating
    if (filters.minimumRating) {
      where.rating = {
        gte: filters.minimumRating
      };
    }

    // Filter by price range
    if (filters.minPrice) {
      where.pricePerSession = {
        ...where.pricePerSession,
        gte: filters.minPrice.amount
      };
    }

    if (filters.maxPrice) {
      where.pricePerSession = {
        ...where.pricePerSession,
        lte: filters.maxPrice.amount
      };
    }

    // Build order by clause
    const orderBy: any = {};
    switch (filters.sortBy) {
      case 'rating':
        orderBy.rating = filters.sortOrder || 'desc';
        break;
      case 'price':
        orderBy.pricePerSession = filters.sortOrder || 'asc';
        break;
      case 'createdAt':
        orderBy.createdAt = filters.sortOrder || 'desc';
        break;
      default:
        orderBy.rating = 'desc';
    }

    // Execute queries
    const [trainers, total] = await Promise.all([
      this.prisma.trainer.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      this.prisma.trainer.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      trainers: trainers.map(trainer => this.mapToDomain(trainer)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  async save(trainer: Trainer): Promise<void> {
    // Check if trainer exists
    const existingTrainer = await this.prisma.trainer.findUnique({
      where: { id: trainer.id }
    });

    if (existingTrainer) {
      // Update existing trainer (excluding id and userId)
      await this.prisma.trainer.update({
        where: { id: trainer.id },
        data: {
          bio: trainer.bio,
          specialties: trainer.specialties.map(s => s.value),
          languages: trainer.languages.map(l => l.code),
          rating: trainer.rating?.value || null,
          pricePerSession: trainer.pricePerSession?.amount || null,
          availableTimes: JSON.parse(JSON.stringify(trainer.availableTimes.toJSON())),
          isActive: trainer.isActive,
          metadata: trainer.metadata,
          updatedAt: trainer.updatedAt
        }
      });
    } else {
      // Create new trainer
      await this.prisma.trainer.create({
        data: {
          id: trainer.id,
          userId: trainer.userId,
          bio: trainer.bio,
          specialties: trainer.specialties.map(s => s.value),
          languages: trainer.languages.map(l => l.code),
          rating: trainer.rating?.value || null,
          pricePerSession: trainer.pricePerSession?.amount || null,
          availableTimes: JSON.parse(JSON.stringify(trainer.availableTimes.toJSON())),
          isActive: trainer.isActive,
          metadata: trainer.metadata,
          createdAt: trainer.createdAt,
          updatedAt: trainer.updatedAt
        }
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.trainer.delete({
      where: { id }
    });
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.trainer.count({
      where: { userId }
    });
    return count > 0;
  }

  async findBySpecialty(specialty: TrainerSpecialty): Promise<Trainer[]> {
    // This would need JSON array operations in real implementation
    const trainers = await this.prisma.trainer.findMany({
      where: {
        isActive: true
      }
    });

    return trainers
      .map(trainer => this.mapToDomain(trainer))
      .filter(trainer => trainer.hasSpecialty(specialty));
  }

  async findByLanguage(language: TrainerLanguage): Promise<Trainer[]> {
    // This would need JSON array operations in real implementation
    const trainers = await this.prisma.trainer.findMany({
      where: {
        isActive: true
      }
    });

    return trainers
      .map(trainer => this.mapToDomain(trainer))
      .filter(trainer => trainer.speaksLanguage(language));
  }

  async findByPriceRange(minPrice: Money, maxPrice: Money): Promise<Trainer[]> {
    const trainers = await this.prisma.trainer.findMany({
      where: {
        pricePerSession: {
          gte: minPrice.amount,
          lte: maxPrice.amount
        },
        isActive: true
      }
    });

    return trainers.map(trainer => this.mapToDomain(trainer));
  }

  async findByMinimumRating(minimumRating: number): Promise<Trainer[]> {
    const trainers = await this.prisma.trainer.findMany({
      where: {
        rating: {
          gte: minimumRating
        },
        isActive: true
      }
    });

    return trainers.map(trainer => this.mapToDomain(trainer));
  }

  async countActive(): Promise<number> {
    return this.prisma.trainer.count({
      where: { isActive: true }
    });
  }

  private mapToDomain(trainerData: any): Trainer {
    // Map specialties
    const specialties = Array.isArray(trainerData.specialties)
      ? trainerData.specialties.map((s: string) => TrainerSpecialty.create(s))
      : [];

    // Map languages
    const languages = Array.isArray(trainerData.languages)
      ? trainerData.languages.map((l: string) => TrainerLanguage.create(l))
      : [TrainerLanguage.create('ES')]; // Default language

    // Map rating
    const rating = trainerData.rating
      ? TrainerRating.create(trainerData.rating, 0)
      : null;

    // Map price
    const pricePerSession = trainerData.pricePerSession
      ? Money.create(trainerData.pricePerSession, 'EUR')
      : null;

    // Map availability
    const availableTimes = TrainerAvailability.create(
      trainerData.availableTimes || {}
    );

    return new Trainer(
      trainerData.id,
      trainerData.userId,
      trainerData.bio,
      specialties,
      languages,
      rating,
      pricePerSession,
      availableTimes,
      trainerData.isActive,
      trainerData.createdAt,
      trainerData.updatedAt,
      trainerData.metadata || {}
    );
  }
} 