import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@libs/src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@libs/src/auth/guards/roles.guard';
import { Roles } from '@libs/src/auth/decorators/roles.decorator';
import { UserRole } from '@libs/src/auth/enums/user-role.enum';
import { CreateRoutineDto } from '../dtos/create-routine.dto';
import { UpdateRoutineDto } from '../dtos/update-routine.dto';
import { CreateRoutineUseCase } from '../../application/use-cases/create-routine.use-case';
import { UpdateRoutineUseCase } from '../../application/use-cases/update-routine.use-case';
import { DeleteRoutineUseCase } from '../../application/use-cases/delete-routine.use-case';
import { ListTrainerRoutinesUseCase } from '../../application/use-cases/list-trainer-routines.use-case';
import { GetRoutineUseCase } from '../../application/use-cases/get-routine.use-case';
import { Routine } from '../../domain/entities/routine.entity';
import { User } from '@libs/src/auth/decorators/user.decorator';

@ApiTags('routines')
@Controller('routines')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoutineController {
  constructor(
    private readonly createRoutineUseCase: CreateRoutineUseCase,
    private readonly updateRoutineUseCase: UpdateRoutineUseCase,
    private readonly deleteRoutineUseCase: DeleteRoutineUseCase,
    private readonly listTrainerRoutinesUseCase: ListTrainerRoutinesUseCase,
    private readonly getRoutineUseCase: GetRoutineUseCase,
  ) {}

  @Post()
  @Roles(UserRole.TRAINER)
  @ApiOperation({ summary: 'Create a new routine' })
  @ApiResponse({ status: 201, description: 'Routine created successfully' })
  async createRoutine(
    @User('id') trainerId: string,
    @Body() createRoutineDto: CreateRoutineDto,
  ): Promise<Routine> {
    return this.createRoutineUseCase.execute(trainerId, createRoutineDto);
  }

  @Put(':id')
  @Roles(UserRole.TRAINER)
  @ApiOperation({ summary: 'Update a routine' })
  @ApiResponse({ status: 200, description: 'Routine updated successfully' })
  async updateRoutine(
    @User('id') trainerId: string,
    @Param('id') routineId: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ): Promise<Routine> {
    return this.updateRoutineUseCase.execute(trainerId, routineId, updateRoutineDto);
  }

  @Delete(':id')
  @Roles(UserRole.TRAINER)
  @ApiOperation({ summary: 'Delete a routine' })
  @ApiResponse({ status: 200, description: 'Routine deleted successfully' })
  async deleteRoutine(
    @User('id') trainerId: string,
    @Param('id') routineId: string,
  ): Promise<void> {
    return this.deleteRoutineUseCase.execute(trainerId, routineId);
  }

  @Get('me')
  @Roles(UserRole.TRAINER)
  @ApiOperation({ summary: 'Get trainer\'s routines' })
  @ApiResponse({ status: 200, description: 'List of routines' })
  async getMyRoutines(
    @User('id') trainerId: string,
    @Query('includeUnpublished') includeUnpublished?: boolean,
  ): Promise<Routine[]> {
    return this.listTrainerRoutinesUseCase.execute(trainerId, includeUnpublished);
  }

  @Get('trainers/:trainerId')
  @ApiOperation({ summary: 'Get trainer\'s published routines' })
  @ApiResponse({ status: 200, description: 'List of published routines' })
  async getTrainerRoutines(
    @Param('trainerId') trainerId: string,
  ): Promise<Routine[]> {
    return this.listTrainerRoutinesUseCase.execute(trainerId, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific routine' })
  @ApiResponse({ status: 200, description: 'Routine details' })
  async getRoutine(
    @Param('id') routineId: string,
    @User('id') userId: string,
    @User('role') userRole: UserRole,
  ): Promise<Routine> {
    const isTrainer = userRole === UserRole.TRAINER;
    return this.getRoutineUseCase.execute(routineId, userId, isTrainer);
  }
} 