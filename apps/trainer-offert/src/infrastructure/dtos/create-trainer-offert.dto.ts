import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainerOffertDto {
  @ApiProperty({ description: 'ID del entrenador' })
  @IsString()
  @IsNotEmpty()
  trainerId: string;

  @ApiProperty({ description: 'Título de la oferta' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descripción de la oferta' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Precio de la oferta' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Moneda de la oferta' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Duración en días de la oferta' })
  @IsNumber()
  @Min(1)
  durationInDays: number;

  @ApiProperty({ description: 'Indica si la oferta incluye reservas' })
  @IsBoolean()
  includesBookings: boolean;

  @ApiPropertyOptional({ description: 'Cupo de reservas incluido en la oferta' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  bookingQuota?: number;
} 