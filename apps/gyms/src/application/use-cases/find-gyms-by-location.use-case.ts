import { Injectable, Inject } from '@nestjs/common';
import { Gym } from '../../domain/entities/gym.entity';
import { GymRepository, GymFilters } from '../../domain/repositories/gym.repository';

export interface FindGymsByLocationQuery {
  latitude: number;
  longitude: number;
  maxDistance?: number; // in kilometers, default 10km
  name?: string;
  limit?: number;
  offset?: number;
}

export interface GymWithDistance extends Gym {
  distance: number; // in kilometers
}

@Injectable()
export class FindGymsByLocationUseCase {
  constructor(@Inject('GymRepository') private readonly gymRepository: GymRepository) {}

  async execute(query: FindGymsByLocationQuery): Promise<GymWithDistance[]> {
    const maxDistance = query.maxDistance || 10; // Default 10km radius
    
    const filters: GymFilters = {
      latitude: query.latitude,
      longitude: query.longitude,
      maxDistance,
      name: query.name,
    };

    const gyms = await this.gymRepository.findByFilters(filters);

    // Calculate distances and sort by distance
    const gymsWithDistance: GymWithDistance[] = gyms
      .map(gym => {
        const distance = this.calculateDistance(
          query.latitude,
          query.longitude,
          gym.location.latitude,
          gym.location.longitude
        );
        return Object.assign(gym, { distance });
      })
      .sort((a, b) => a.distance - b.distance);

    // Apply pagination if provided
    if (query.offset !== undefined || query.limit !== undefined) {
      const offset = query.offset || 0;
      const limit = query.limit || 20;
      return gymsWithDistance.slice(offset, offset + limit);
    }

    return gymsWithDistance;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * 
      Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 100) / 100; // Round to 2 decimal places
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 