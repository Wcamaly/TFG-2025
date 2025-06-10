import { UserRole } from '@/apps/users/src/domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export class RegisterResponseDto {
  user: UserResponseDto;
  token: string;
  message: string;
}

export class LoginResponseDto {
  user: UserResponseDto;
  token: string;
  message: string;
} 