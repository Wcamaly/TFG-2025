import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PasswordRecoveryService } from '@core/index';


@Injectable()
export class InMemoryPasswordRecoveryService implements PasswordRecoveryService {
  private readonly tokens = new Map<string, { email: string; expiresAt: Date }>();
  private readonly TOKEN_EXPIRY_HOURS = 1;

  generateToken(email: string): string {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRY_HOURS);

    this.tokens.set(token, { email, expiresAt });
    return token;
  }

  validateToken(token: string): string | null {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return null;
    }

    if (new Date() > tokenData.expiresAt) {
      this.tokens.delete(token);
      return null;
    }

    return tokenData.email;
  }

  invalidateToken(token: string): void {
    this.tokens.delete(token);
  }
} 