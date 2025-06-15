import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '@/apps/users/src/domain/entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
} 