import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { Profile } from '@/apps/users/src/domain/entities/profile.entity';
import { UpdateProfileDto } from '@/apps/users/src/presentation/dtos/update-profile.dto';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, profileData: UpdateProfileDto): Promise<Profile> {
    return this.userRepository.updateProfile(id, profileData);
  }
} 