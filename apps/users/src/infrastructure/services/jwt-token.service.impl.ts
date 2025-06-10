import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '@core/interfaces/jwt-token.service';
import { User } from '@/apps/users/src/domain/entities/user.entity';
import { UserJwtPayload, UserTokenData } from '@/apps/users/src/domain/types/auth.types';

@Injectable()
export class JwtTokenServiceImpl implements JwtTokenService<User> {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    const tokenData: UserTokenData = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const payload: UserJwtPayload = {
      sub: user.id,
      data: tokenData,
    };

    return this.jwtService.signAsync(payload);
  }
} 