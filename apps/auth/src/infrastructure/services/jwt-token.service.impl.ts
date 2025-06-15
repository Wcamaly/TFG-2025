import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '@core/index';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class JwtTokenServiceImpl implements JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  generateToken(entity: any): Promise<string> {
    throw new Error('Method not implemented.');
  }
  verifyToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async generateAccessToken(auth: Auth): Promise<string> {
    const payload = {
      sub: auth.id,
      email: auth.email,
      role: auth.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
    });
  }

  async generateRefreshToken(auth: Auth): Promise<string> {
    const payload = {
      sub: auth.id,
      email: auth.email,
      role: auth.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }

  async generateResetToken(auth: Auth): Promise<string> {
    const payload = {
      sub: auth.id,
      email: auth.email,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_RESET_SECRET'),
      expiresIn: this.configService.get<string>('JWT_RESET_EXPIRATION', '1h'),
    });
  }

  async verifyAccessToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async verifyResetToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_RESET_SECRET'),
    });
  }
} 