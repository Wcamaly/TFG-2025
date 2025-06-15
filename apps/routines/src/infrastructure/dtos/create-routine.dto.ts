import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsArray, Min, IsOptional, IsBoolean } from 'class-validator';
import { RoutineDifficulty } from '../../domain/entities/routine.entity';

export class CreateRoutineDto {
  @ApiProperty({ description: 'Título de la rutina' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción detallada de la rutina' })
  @IsString()
  description: string;

  @ApiProperty({ enum: RoutineDifficulty, description: 'Nivel de dificultad' })
  @IsEnum(RoutineDifficulty)
  difficulty: RoutineDifficulty;

  @ApiProperty({ description: 'Duración en días' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Idioma del contenido' })
  @IsString()
  language: string;

  @ApiProperty({ description: 'Etiquetas relacionadas', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Publicar inmediatamente', default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
} 