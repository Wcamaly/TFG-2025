import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/prisma/prisma.service';
import { Gym } from '../../domain/entities/gym.entity';
import { GymRepository, GymFilters } from '../../domain/repositories/gym.repository';

@Injectable()
export class PrismaGymRepository implements GymRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Gym | null> {
    const gymData = await this.prisma.gym.findUnique({
      where: { id },
    });

    return gymData ? this.toDomain(gymData) : null;
  }

  async findByName(name: string): Promise<Gym | null> {
    const gymData = await this.prisma.gym.findFirst({
      where: { name },
    });

    return gymData ? this.toDomain(gymData) : null;
  }

  async findByLocation(latitude: number, longitude: number, maxDistance: number): Promise<Gym[]> {
    // Using Prisma raw query for geospatial calculations
    const gyms = await this.prisma.$queryRaw`
      SELECT * FROM gyms 
      WHERE ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${maxDistance * 1000}
      )
      AND "isActive" = true
      ORDER BY ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography
      )
    `;

    return (gyms as any[]).map(gym => this.toDomain(gym));
  }

  async findByFilters(filters: GymFilters): Promise<Gym[]> {
    const where: any = {
      isActive: true,
    };

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.ownerId) {
      where.ownerId = filters.ownerId;
    }

    // For location-based filtering, use raw query if coordinates are provided
    if (filters.latitude && filters.longitude && filters.maxDistance) {
      return this.findByLocation(filters.latitude, filters.longitude, filters.maxDistance);
    }

    const gyms = await this.prisma.gym.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return gyms.map(gym => this.toDomain(gym));
  }

  async findByOwnerId(ownerId: string): Promise<Gym[]> {
    const gyms = await this.prisma.gym.findMany({
      where: { ownerId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return gyms.map(gym => this.toDomain(gym));
  }

  async save(gym: Gym): Promise<Gym> {
    const gymData = await this.prisma.gym.create({
      data: this.toPersistence(gym),
    });

    return this.toDomain(gymData);
  }

  async update(id: string, gym: Gym): Promise<Gym> {
    const gymData = await this.prisma.gym.update({
      where: { id },
      data: this.toPersistence(gym),
    });

    return this.toDomain(gymData);
  }

  async delete(id: string): Promise<void> {
    // Soft delete - mark as inactive
    await this.prisma.gym.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  async existsByNameAndLocation(
    name: string, 
    latitude: number, 
    longitude: number, 
    radiusKm: number = 1
  ): Promise<boolean> {
    const gyms = await this.prisma.$queryRaw`
      SELECT id FROM gyms 
      WHERE name = ${name}
      AND ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        ${radiusKm * 1000}
      )
      AND "isActive" = true
      LIMIT 1
    `;

    return (gyms as any[]).length > 0;
  }

  private toDomain(gymData: any): Gym {
    return new Gym(
      gymData.id,
      gymData.name,
      gymData.description,
      gymData.address,
      {
        latitude: gymData.latitude,
        longitude: gymData.longitude,
      },
      gymData.phone,
      gymData.email,
      gymData.openingHours,
      gymData.ownerId,
      gymData.createdAt,
      gymData.updatedAt,
      gymData.isActive
    );
  }

  private toPersistence(gym: Gym): any {
    return {
      id: gym.id,
      name: gym.name,
      description: gym.description,
      address: gym.address,
      latitude: gym.location.latitude,
      longitude: gym.location.longitude,
      phone: gym.phone,
      email: gym.email,
      openingHours: gym.openingHours,
      ownerId: gym.ownerId,
      createdAt: gym.createdAt,
      updatedAt: gym.updatedAt,
      isActive: gym.isActive,
    };
  }
} 