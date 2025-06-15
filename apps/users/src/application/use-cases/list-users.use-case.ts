import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';
import { User } from '@/apps/users/src/domain/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
} 