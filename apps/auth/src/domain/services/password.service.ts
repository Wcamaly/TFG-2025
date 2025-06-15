export interface PasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const PASSWORD_SERVICE = Symbol('PASSWORD_SERVICE'); 