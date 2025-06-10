export interface JwtTokenService<T = any> {
  generateToken(entity: T): Promise<string>;
}

export const JWT_TOKEN_SERVICE = Symbol('JWT_TOKEN_SERVICE'); 