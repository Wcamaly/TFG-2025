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
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { CreateGymDto } from '../dtos/create-gym.dto';
import { UpdateGymDto } from '../dtos/update-gym.dto';
import { FindGymsDto } from '../dtos/find-gyms.dto';
import { GymResponseDto, GymWithDistanceResponseDto } from '../dtos/gym-response.dto';
import { CreateGymUseCase, GymAlreadyExistsError } from '../../application/use-cases/create-gym.use-case';
import { UpdateGymUseCase, GymNotFoundError, UnauthorizedUpdateError } from '../../application/use-cases/update-gym.use-case';
import { FindGymsByLocationUseCase } from '../../application/use-cases/find-gyms-by-location.use-case';
import { GetGymDetailsUseCase } from '../../application/use-cases/get-gym-details.use-case';
import { DeleteGymUseCase, UnauthorizedDeleteError } from '../../application/use-cases/delete-gym.use-case';

@ApiTags('Gyms')
@Controller('gyms')
export class GymsController {
  constructor(
    private readonly createGymUseCase: CreateGymUseCase,
    private readonly updateGymUseCase: UpdateGymUseCase,
    private readonly findGymsByLocationUseCase: FindGymsByLocationUseCase,
    private readonly getGymDetailsUseCase: GetGymDetailsUseCase,
    private readonly deleteGymUseCase: DeleteGymUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new gym' })
  @ApiResponse({ status: 201, description: 'Gym created successfully', type: GymResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @ApiResponse({ status: 409, description: 'Gym already exists in this location' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createGym(@Body() createGymDto: CreateGymDto, @Req() req: any): Promise<GymResponseDto> {
    try {
      const gym = await this.createGymUseCase.execute({
        ...createGymDto,
        ownerId: req.user.id,
      });

      return this.toGymResponse(gym);
    } catch (error) {
      if (error instanceof GymAlreadyExistsError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find gyms by location' })
  @ApiResponse({ status: 200, description: 'Gyms found successfully', type: [GymWithDistanceResponseDto] })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  async findGyms(@Query() findGymsDto: FindGymsDto): Promise<GymWithDistanceResponseDto[]> {
    try {
      const gyms = await this.findGymsByLocationUseCase.execute(findGymsDto);
      return gyms.map(gym => this.toGymWithDistanceResponse(gym));
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gym details by ID' })
  @ApiParam({ name: 'id', description: 'Gym ID', example: 'uuid-here' })
  @ApiResponse({ status: 200, description: 'Gym details retrieved successfully', type: GymResponseDto })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async getGymDetails(@Param('id') id: string): Promise<GymResponseDto> {
    try {
      const gym = await this.getGymDetailsUseCase.execute({ gymId: id });
      return this.toGymResponse(gym);
    } catch (error) {
      if (error instanceof GymNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update gym information' })
  @ApiParam({ name: 'id', description: 'Gym ID', example: 'uuid-here' })
  @ApiResponse({ status: 200, description: 'Gym updated successfully', type: GymResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not gym owner' })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async updateGym(
    @Param('id') id: string,
    @Body() updateGymDto: UpdateGymDto,
    @Req() req: any,
  ): Promise<GymResponseDto> {
    try {
      const gym = await this.updateGymUseCase.execute({
        gymId: id,
        ownerId: req.user.id,
        ...updateGymDto,
      });

      return this.toGymResponse(gym);
    } catch (error) {
      if (error instanceof GymNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof UnauthorizedUpdateError) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete gym' })
  @ApiParam({ name: 'id', description: 'Gym ID', example: 'uuid-here' })
  @ApiResponse({ status: 204, description: 'Gym deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not gym owner' })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async deleteGym(@Param('id') id: string, @Req() req: any): Promise<void> {
    try {
      await this.deleteGymUseCase.execute({
        gymId: id,
        ownerId: req.user.id,
      });
    } catch (error) {
      if (error instanceof GymNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof UnauthorizedDeleteError) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private toGymResponse(gym: any): GymResponseDto {
    return {
      id: gym.id,
      name: gym.name,
      description: gym.description,
      address: gym.address,
      location: gym.location,
      phone: gym.phone,
      email: gym.email,
      openingHours: gym.openingHours,
      ownerId: gym.ownerId,
      createdAt: gym.createdAt,
      updatedAt: gym.updatedAt,
      isActive: gym.isActive,
    };
  }

  private toGymWithDistanceResponse(gym: any): GymWithDistanceResponseDto {
    return {
      ...this.toGymResponse(gym),
      distance: gym.distance,
    };
  }
} 