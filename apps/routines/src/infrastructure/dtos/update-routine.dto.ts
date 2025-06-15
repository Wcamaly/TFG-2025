import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsArray, Min, IsOptional, IsBoolean } from 'class-validator';
import { RoutineDifficulty } from '../../domain/entities/routine.entity';

export class UpdateRoutineDto {
  @ApiProperty({ description: 'Título de la rutina', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Descripción detallada de la rutina', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RoutineDifficulty, description: 'Nivel de dificultad', required: false })
  @IsOptional()
  @IsEnum(RoutineDifficulty)
  difficulty?: RoutineDifficulty;

  @ApiProperty({ description: 'Duración en días', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ description: 'Idioma del contenido', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Etiquetas relacionadas', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Estado de publicación', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
} 