import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';

import { CreateTrainerUseCase } from '../../application/use-cases/create-trainer.use-case';
import { GetTrainerByIdUseCase } from '../../application/use-cases/get-trainer-by-id.use-case';
import { SearchTrainersUseCase } from '../../application/use-cases/search-trainers.use-case';
import { UpdateTrainerUseCase } from '../../application/use-cases/update-trainer.use-case';
import { DeleteTrainerUseCase } from '../../application/use-cases/delete-trainer.use-case';

import { CreateTrainerDto } from '../dtos/create-trainer.dto';
import { SearchTrainersDto } from '../dtos/search-trainers.dto';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(
    private readonly createTrainerUseCase: CreateTrainerUseCase,
    private readonly getTrainerByIdUseCase: GetTrainerByIdUseCase,
    private readonly searchTrainersUseCase: SearchTrainersUseCase,
    private readonly updateTrainerUseCase: UpdateTrainerUseCase,
    private readonly deleteTrainerUseCase: DeleteTrainerUseCase
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create trainer profile',
    description: 'Allows a user to create their trainer profile with specialties, languages, and availability'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Trainer profile created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        userId: { type: 'string', example: 'uuid-string' },
        message: { type: 'string', example: 'Perfil de entrenador creado exitosamente' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'User already has a trainer profile' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async createTrainer(@Body() createTrainerDto: CreateTrainerDto) {
    const result = await this.createTrainerUseCase.execute({
      userId: createTrainerDto.userId,
      bio: createTrainerDto.bio,
      specialties: createTrainerDto.specialties,
      languages: createTrainerDto.languages,
      pricePerSession: createTrainerDto.pricePerSession,
      availableTimes: createTrainerDto.availableTimes,
      metadata: createTrainerDto.metadata
    });

    return {
      statusCode: HttpStatus.CREATED,
      data: result
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Search trainers',
    description: 'Search trainers by various filters including specialties, languages, price, rating, and location'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trainers found successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            trainers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  bio: { type: 'string', nullable: true },
                  specialties: { type: 'array', items: { type: 'string' } },
                  languages: { type: 'array', items: { type: 'string' } },
                  rating: { 
                    type: 'object', 
                    nullable: true,
                    properties: {
                      value: { type: 'number' },
                      reviewCount: { type: 'number' },
                      category: { type: 'string' }
                    }
                  },
                  pricePerSession: { 
                    type: 'object', 
                    nullable: true,
                    properties: {
                      amount: { type: 'number' },
                      currency: { type: 'string' }
                    }
                  },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrevious: { type: 'boolean' }
          }
        }
      }
    }
  })
  async searchTrainers(@Query() searchDto: SearchTrainersDto) {
    const query = {
      ...searchDto,
      minPrice: searchDto.minPrice ? { 
        amount: searchDto.minPrice, 
        currency: searchDto.currency || 'EUR' 
      } : undefined,
      maxPrice: searchDto.maxPrice ? { 
        amount: searchDto.maxPrice, 
        currency: searchDto.currency || 'EUR' 
      } : undefined
    };

    const result = await this.searchTrainersUseCase.execute(query);

    return {
      statusCode: HttpStatus.OK,
      data: result
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get trainer by ID',
    description: 'Get detailed information about a specific trainer'
  })
  @ApiParam({ name: 'id', description: 'Trainer ID', example: 'uuid-string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trainer found successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            bio: { type: 'string', nullable: true },
            specialties: { type: 'array', items: { type: 'string' } },
            languages: { type: 'array', items: { type: 'string' } },
            rating: { 
              type: 'object', 
              nullable: true,
              properties: {
                value: { type: 'number' },
                reviewCount: { type: 'number' },
                category: { type: 'string' }
              }
            },
            pricePerSession: { 
              type: 'object', 
              nullable: true,
              properties: {
                amount: { type: 'number' },
                currency: { type: 'string' }
              }
            },
            availableTimes: { type: 'object' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            metadata: { type: 'object' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Trainer not found' 
  })
  async getTrainerById(@Param('id') id: string) {
    const result = await this.getTrainerByIdUseCase.execute({ id });

    return {
      statusCode: HttpStatus.OK,
      data: result
    };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update trainer profile',
    description: 'Update trainer profile information. Only the trainer owner can update their profile.'
  })
  @ApiParam({ name: 'id', description: 'Trainer ID', example: 'uuid-string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trainer profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string', example: 'Perfil de entrenador actualizado exitosamente' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Trainer not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Not authorized to update this profile' 
  })
  async updateTrainer(
    @Param('id') id: string,
    @Body() updateTrainerDto: Partial<CreateTrainerDto>,
    @Request() req: any // TODO: Replace with proper auth guard
  ) {
    // TODO: Extract userId from JWT token
    const userId = req.user?.id || updateTrainerDto.userId;

    const result = await this.updateTrainerUseCase.execute({
      trainerId: id,
      userId,
      bio: updateTrainerDto.bio,
      specialties: updateTrainerDto.specialties,
      languages: updateTrainerDto.languages,
      pricePerSession: updateTrainerDto.pricePerSession,
      availableTimes: updateTrainerDto.availableTimes,
      metadata: updateTrainerDto.metadata
    });

    return {
      statusCode: HttpStatus.OK,
      data: result
    };
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete trainer profile',
    description: 'Delete trainer profile. Only the trainer owner can delete their profile.'
  })
  @ApiParam({ name: 'id', description: 'Trainer ID', example: 'uuid-string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Trainer profile deleted successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string', example: 'Perfil de entrenador eliminado exitosamente' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Trainer not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Not authorized to delete this profile' 
  })
  async deleteTrainer(
    @Param('id') id: string,
    @Request() req: any // TODO: Replace with proper auth guard
  ) {
    // TODO: Extract userId from JWT token
    const userId = req.user?.id;

    const result = await this.deleteTrainerUseCase.execute({
      trainerId: id,
      userId
    });

    return {
      statusCode: HttpStatus.OK,
      data: result
    };
  }

  @Get('specialties/list')
  @ApiOperation({ 
    summary: 'Get available specialties',
    description: 'Get list of all available trainer specialties'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Specialties retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  async getAvailableSpecialties() {
    // Import here to avoid circular dependencies
    const { TrainerSpecialty } = await import('../../domain/value-objects/trainer-specialty.vo');
    
    return {
      statusCode: HttpStatus.OK,
      data: TrainerSpecialty.getValidSpecialties()
    };
  }

  @Get('languages/list')
  @ApiOperation({ 
    summary: 'Get available languages',
    description: 'Get list of all available languages'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Languages retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  async getAvailableLanguages() {
    // Import here to avoid circular dependencies
    const { TrainerLanguage } = await import('../../domain/value-objects/trainer-language.vo');
    
    return {
      statusCode: HttpStatus.OK,
      data: TrainerLanguage.getValidLanguages()
    };
  }
} 