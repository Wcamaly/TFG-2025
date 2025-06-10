export interface PasswordHashingService {
  hash(password: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_HASHING_SERVICE = Symbol('PASSWORD_HASHING_SERVICE'); 