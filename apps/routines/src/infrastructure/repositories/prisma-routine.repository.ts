import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/src/infra/prisma/prisma.service';
import { Routine } from '../../domain/entities/routine.entity';
import { IRoutineRepository } from '../../domain/repositories/routine.repository';

@Injectable()
export class PrismaRoutineRepository implements IRoutineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(routine: Routine): Promise<Routine> {
    const created = await this.prisma.routine.create({
      data: {
        id: routine.getId(),
        trainerId: routine.getTrainerId(),
        title: routine.getTitle(),
        description: routine.getDescription(),
        difficulty: routine.getDifficulty(),
        duration: routine.getDuration(),
        language: routine.getLanguage(),
        tags: routine.getTags(),
        published: routine.isPublished(),
        createdAt: routine.getCreatedAt(),
        updatedAt: routine.getUpdatedAt(),
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Routine | null> {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
    });

    if (!routine) return null;
    return this.toDomain(routine);
  }

  async findByTrainerId(trainerId: string): Promise<Routine[]> {
    const routines = await this.prisma.routine.findMany({
      where: { trainerId },
    });

    return routines.map(this.toDomain);
  }

  async findPublishedByTrainerId(trainerId: string): Promise<Routine[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        trainerId,
        published: true,
      },
    });

    return routines.map(this.toDomain);
  }

  async update(routine: Routine): Promise<Routine> {
    const updated = await this.prisma.routine.update({
      where: { id: routine.getId() },
      data: {
        title: routine.getTitle(),
        description: routine.getDescription(),
        difficulty: routine.getDifficulty(),
        duration: routine.getDuration(),
        language: routine.getLanguage(),
        tags: routine.getTags(),
        published: routine.isPublished(),
        updatedAt: routine.getUpdatedAt(),
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.routine.delete({
      where: { id },
    });
  }

  private toDomain(prismaRoutine: any): Routine {
    return new Routine({
      id: prismaRoutine.id,
      trainerId: prismaRoutine.trainerId,
      title: prismaRoutine.title,
      description: prismaRoutine.description,
      difficulty: prismaRoutine.difficulty,
      duration: prismaRoutine.duration,
      language: prismaRoutine.language,
      tags: prismaRoutine.tags,
      isPublished: prismaRoutine.published,
      createdAt: prismaRoutine.createdAt,
      updatedAt: prismaRoutine.updatedAt,
    });
  }
} 