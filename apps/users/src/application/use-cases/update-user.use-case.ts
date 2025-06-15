import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { User } from '@/apps/users/src/domain/entities/user.entity';
import { UpdateUserDto } from '@/apps/users/src/presentation/dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, userData: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, userData);
  }
} 