export interface PasswordRecoveryService {
  generateToken(email: string): string;
  validateToken(token: string): string | null;
  invalidateToken(token: string): void;
}

export const PASSWORD_RECOVERY_SERVICE = Symbol('PASSWORD_RECOVERY_SERVICE'); 