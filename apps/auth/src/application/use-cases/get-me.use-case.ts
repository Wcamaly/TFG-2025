import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';

export interface GetMeCommand {
  userId: string;
}

export interface GetMeResult {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  lastLogin: Date;
}

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: GetMeCommand): Promise<GetMeResult> {
    const auth = await this.authRepository.findById(command.userId);
    if (!auth) {
      throw new NotFoundException('User not found');
    }

    return {
      id: auth.id,
      email: auth.email,
      role: auth.role,
      isVerified: auth.isVerified,
      lastLogin: auth.lastLogin,
    };
  }
} 