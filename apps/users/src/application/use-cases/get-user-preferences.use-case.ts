import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { UserPreferences } from '@/apps/users/src/domain/entities/user-preferences.entity';

@Injectable()
export class GetUserPreferencesUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<UserPreferences> {
    return this.userRepository.findPreferences(id);
  }
} 