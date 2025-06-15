import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase, RegisterUserCommand } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase, LoginUserCommand } from '../../application/use-cases/login-user.use-case';
import { ForgotPasswordUseCase, ForgotPasswordCommand } from '../../application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase, ResetPasswordCommand } from '../../application/use-cases/reset-password.use-case';
import { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import { JwtAuthGuard } from '@core/index';
import { CurrentUser } from '@core/index';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('register')
  async register(@Body() command: RegisterUserCommand) {
    return this.registerUserUseCase.execute(command);
  }

  @Post('login')
  async login(@Body() command: LoginUserCommand) {
    return this.loginUserUseCase.execute(command);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() command: ForgotPasswordCommand) {
    return this.forgotPasswordUseCase.execute(command);
  }

  @Post('reset-password')
  async resetPassword(@Body() command: ResetPasswordCommand) {
    return this.resetPasswordUseCase.execute(command);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() userId: string) {
    return this.getMeUseCase.execute({ userId });
  }
} 