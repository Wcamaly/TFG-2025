import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FindGymsDto {
  @ApiProperty({ description: 'User latitude coordinate', example: 40.7128 })
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ description: 'User longitude coordinate', example: -74.0060 })
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  @Type(() => Number)
  longitude: number;

  @ApiProperty({ description: 'Maximum distance in kilometers', example: 10, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum distance must be a number' })
  @Min(0.1, { message: 'Maximum distance must be greater than 0.1km' })
  @Max(100, { message: 'Maximum distance cannot exceed 100km' })
  @Type(() => Number)
  maxDistance?: number;

  @ApiProperty({ description: 'Filter by gym name', example: 'Fitness', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({ description: 'Number of results to return', example: 20, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ description: 'Number of results to skip', example: 0, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Offset must be a number' })
  @Min(0, { message: 'Offset must be 0 or greater' })
  @Type(() => Number)
  offset?: number;
} 