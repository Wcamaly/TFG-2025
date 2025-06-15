import { JwtTokenService } from "@core/interfaces/jwt-token.service";
import { JwtService } from "@nestjs/jwt";

export class JwtTokenServiceImpl implements JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(entity: any): Promise<string> {
    return this.jwtService.signAsync(entity);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  async verifyResetToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  async generateRefreshToken(entity: any): Promise<string> {
    return this.jwtService.signAsync(entity);
  }

  async generateResetToken(entity: any): Promise<string> {
    return this.jwtService.signAsync(entity);
  }

  async generateToken(entity: any): Promise<string> {
    return this.jwtService.signAsync(entity);
  }
}