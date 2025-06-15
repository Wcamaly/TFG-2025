import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { User } from '@/apps/users/src/domain/entities/user.entity';
import { Profile } from '@/apps/users/src/domain/entities/profile.entity';
import { UserPreferences } from '@/apps/users/src/domain/entities/user-preferences.entity';
import { GetUserUseCase } from '@/apps/users/src/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '@/apps/users/src/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '@/apps/users/src/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/apps/users/src/application/use-cases/delete-user.use-case';
import { GetUserProfileUseCase } from '@/apps/users/src/application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@/apps/users/src/application/use-cases/update-user-profile.use-case';
import { GetUserPreferencesUseCase } from '@/apps/users/src/application/use-cases/get-user-preferences.use-case';
import { UpdateUserPreferencesUseCase } from '@/apps/users/src/application/use-cases/update-user-preferences.use-case';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly getUserPreferencesUseCase: GetUserPreferencesUseCase,
    private readonly updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
  ) {}

  @Get()
  async listUsers(): Promise<User[]> {
    return this.listUsersUseCase.execute();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.getUserUseCase.execute(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
    return this.updateUserUseCase.execute(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }

  @Get(':id/profile')
  async getUserProfile(@Param('id') id: string): Promise<Profile> {
    return this.getUserProfileUseCase.execute(id);
  }

  @Put(':id/profile')
  async updateUserProfile(@Param('id') id: string, @Body() profileData: UpdateProfileDto): Promise<Profile> {
    return this.updateUserProfileUseCase.execute(id, profileData);
  }

  @Get(':id/preferences')
  async getUserPreferences(@Param('id') id: string): Promise<UserPreferences> {
    return this.getUserPreferencesUseCase.execute(id);
  }

  @Put(':id/preferences')
  async updateUserPreferences(@Param('id') id: string, @Body() preferencesData: UpdatePreferencesDto): Promise<UserPreferences> {
    return this.updateUserPreferencesUseCase.execute(id, preferencesData);
  }
} 