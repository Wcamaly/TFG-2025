export interface JwtTokenService<T = any> {
  generateToken(entity: T): Promise<string>;
  verifyToken(token: string): Promise<T>;
  verifyResetToken(token: string): Promise<T>;
  generateAccessToken(entity: T): Promise<string>;
  generateRefreshToken(entity: T): Promise<string>;
  generateResetToken(entity: T): Promise<string>;
}

export const JWT_TOKEN_SERVICE = Symbol('JWT_TOKEN_SERVICE'); 