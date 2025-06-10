import { ApiProperty } from '@nestjs/swagger';
import { GymLocationDto, OpeningHoursDto } from './create-gym.dto';

export class GymResponseDto {
  @ApiProperty({ description: 'Gym unique identifier', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Gym name', example: 'FitnessPro Center' })
  name: string;

  @ApiProperty({ description: 'Gym description', example: 'Modern gym with state-of-the-art equipment' })
  description: string;

  @ApiProperty({ description: 'Gym physical address', example: '123 Main St, New York, NY 10001' })
  address: string;

  @ApiProperty({ description: 'Gym location coordinates', type: GymLocationDto })
  location: GymLocationDto;

  @ApiProperty({ description: 'Gym contact phone', example: '+1-555-123-4567' })
  phone: string;

  @ApiProperty({ description: 'Gym contact email', example: 'contact@fitnesspro.com' })
  email: string;

  @ApiProperty({ description: 'Gym opening hours', type: OpeningHoursDto })
  openingHours: OpeningHoursDto;

  @ApiProperty({ description: 'Gym owner ID', example: 'uuid-here' })
  ownerId: string;

  @ApiProperty({ description: 'When the gym was created', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'When the gym was last updated', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the gym is active', example: true })
  isActive: boolean;
}

export class GymWithDistanceResponseDto extends GymResponseDto {
  @ApiProperty({ description: 'Distance from search location in kilometers', example: 2.5 })
  distance: number;
} 