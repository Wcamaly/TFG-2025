import { IsString, IsOptional, IsArray, IsNumber, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MoneyDto {
  @ApiProperty({ description: 'Amount in the specified currency', example: 50.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency code (ISO 4217)', example: 'EUR' })
  @IsString()
  currency: string;
}

export class TimeSlotDto {
  @ApiProperty({ description: 'Start time in HH:mm format', example: '09:00' })
  @IsString()
  start: string;

  @ApiProperty({ description: 'End time in HH:mm format', example: '17:00' })
  @IsString()
  end: string;
}

export class DayAvailabilityDto {
  @ApiProperty({ description: 'Whether the trainer is available on this day' })
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ description: 'Available time slots for this day', type: [TimeSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  @IsOptional()
  timeSlots?: TimeSlotDto[];
}

export class CreateTrainerDto {
  @ApiProperty({ description: 'User ID of the trainer', example: 'uuid-string' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Professional bio/description', example: 'Experienced personal trainer with 5 years of experience...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    description: 'List of specialties', 
    example: ['STRENGTH_TRAINING', 'CARDIO', 'YOGA'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({ 
    description: 'List of languages (ISO 639-1 codes)', 
    example: ['ES', 'EN'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiPropertyOptional({ description: 'Price per session', type: MoneyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  pricePerSession?: MoneyDto;

  @ApiPropertyOptional({ description: 'Weekly availability schedule' })
  @IsOptional()
  @IsObject()
  availableTimes?: {
    MONDAY?: DayAvailabilityDto;
    TUESDAY?: DayAvailabilityDto;
    WEDNESDAY?: DayAvailabilityDto;
    THURSDAY?: DayAvailabilityDto;
    FRIDAY?: DayAvailabilityDto;
    SATURDAY?: DayAvailabilityDto;
    SUNDAY?: DayAvailabilityDto;
  };

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 