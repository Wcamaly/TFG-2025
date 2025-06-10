import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GymLocationDto {
  @ApiProperty({ description: 'Gym latitude coordinate', example: 40.7128 })
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;

  @ApiProperty({ description: 'Gym longitude coordinate', example: -74.0060 })
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;
}

export class OpeningHoursDto {
  @ApiProperty({ description: 'Monday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  monday?: { open: string; close: string };

  @ApiProperty({ description: 'Tuesday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  tuesday?: { open: string; close: string };

  @ApiProperty({ description: 'Wednesday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  wednesday?: { open: string; close: string };

  @ApiProperty({ description: 'Thursday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  thursday?: { open: string; close: string };

  @ApiProperty({ description: 'Friday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  friday?: { open: string; close: string };

  @ApiProperty({ description: 'Saturday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  saturday?: { open: string; close: string };

  @ApiProperty({ description: 'Sunday opening hours', required: false, example: { open: '08:00', close: '22:00' } })
  @IsOptional()
  sunday?: { open: string; close: string };
}

export class CreateGymDto {
  @ApiProperty({ description: 'Gym name', example: 'FitnessPro Center' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'Gym description', example: 'Modern gym with state-of-the-art equipment' })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({ description: 'Gym physical address', example: '123 Main St, New York, NY 10001' })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @ApiProperty({ description: 'Gym location coordinates', type: GymLocationDto })
  @ValidateNested()
  @Type(() => GymLocationDto)
  location: GymLocationDto;

  @ApiProperty({ description: 'Gym contact phone', example: '+1-555-123-4567' })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({ description: 'Gym contact email', example: 'contact@fitnesspro.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'Gym opening hours', type: OpeningHoursDto })
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  openingHours: OpeningHoursDto;
} 