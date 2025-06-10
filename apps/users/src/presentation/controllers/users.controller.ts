import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RegisterResponseDto, LoginResponseDto, UserResponseDto } from '../dtos/user-response.dto';
import { ForgotPasswordUseCase } from '@/apps/users/src/application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '@/apps/users/src/application/use-cases/reset-password.use-case';
import { RegisterUserUseCase } from '@/apps/users/src/application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '@/apps/users/src/application/use-cases/login-user.use-case';
import { GetMeUseCase } from '@/apps/users/src/application/use-cases/get-me.use-case';
import { User } from '@/apps/users/src/domain/entities/user.entity';
import { JwtAuthGuard, CurrentUser } from '@core/index';
import { AuthenticatedUser } from '@/apps/users/src/domain/types/auth.types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<RegisterResponseDto> {
    const result = await this.registerUserUseCase.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
    });

    return {
      user: this.mapUserToDto(result.user),
      token: result.token,
      message: 'User registered successfully',
    };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<LoginResponseDto> {
    const result = await this.loginUserUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    return {
      user: this.mapUserToDto(result.user),
      token: result.token,
      message: 'Login successful',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser<AuthenticatedUser>() user: AuthenticatedUser): Promise<UserResponseDto> {
    const userData = await this.getMeUseCase.execute({
      userId: user.id,
    });

    return this.mapUserToDto(userData);
  }

  private mapUserToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.forgotPasswordUseCase.execute({ email: dto.email });
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetPasswordUseCase.execute({
      token: dto.token,
      newPassword: dto.newPassword,
    });
  }
} 