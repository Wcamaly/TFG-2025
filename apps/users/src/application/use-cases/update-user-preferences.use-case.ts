import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { UserPreferences } from '@/apps/users/src/domain/entities/user-preferences.entity';
import { UpdatePreferencesDto } from '@/apps/users/src/presentation/dtos/update-preferences.dto';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, preferencesData: UpdatePreferencesDto): Promise<UserPreferences> {
    return this.userRepository.updatePreferences(id, preferencesData);
  }
} 