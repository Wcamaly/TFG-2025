import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListTrainerOffertsDto {
  @ApiProperty({ description: 'ID del entrenador' })
  @IsString()
  @IsNotEmpty()
  trainerId: string;

  @ApiPropertyOptional({ description: 'Filtrar solo ofertas activas' })
  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean;
} 