import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '@/apps/users/src/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
} 