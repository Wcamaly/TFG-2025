import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { UserPreferences } from '../entities/user-preferences.entity';
import { UpdateUserDto } from '@/apps/users/src/presentation/dtos/update-user.dto';
import { UpdateProfileDto } from '@/apps/users/src/presentation/dtos/update-profile.dto';
import { UpdatePreferencesDto } from '@/apps/users/src/presentation/dtos/update-preferences.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  findById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  findProfile(id: string): Promise<Profile>;
  updateProfile(id: string, profileData: UpdateProfileDto): Promise<Profile>;
  findPreferences(id: string): Promise<UserPreferences>;
  updatePreferences(id: string, preferencesData: UpdatePreferencesDto): Promise<UserPreferences>;
} 