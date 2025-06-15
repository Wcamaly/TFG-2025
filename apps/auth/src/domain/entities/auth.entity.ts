export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  GYM_OWNER = 'GYM_OWNER',
}

export class Auth {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  failedAttempts: number;
  lastLogin?: Date;
  lastFailedAttempt?: Date;
  lockExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    role: UserRole,
    isActive: boolean = true,
    isLocked: boolean = false,
    failedAttempts: number = 0,
    lastLogin?: Date,
    lastFailedAttempt?: Date,
    lockExpiresAt?: Date,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    this.isLocked = isLocked;
    this.failedAttempts = failedAttempts;
    this.lastLogin = lastLogin;
    this.lastFailedAttempt = lastFailedAttempt;
    this.lockExpiresAt = lockExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Auth {
    return new Auth(
      crypto.randomUUID(),
      email,
      password,
      role,
    );
  }

  static fromPersistence(data: any): Auth {
    return new Auth(
      data.id,
      data.email,
      data.password,
      data.role,
      data.isActive,
      data.isLocked,
      data.failedAttempts,
      data.lastLogin ? new Date(data.lastLogin) : undefined,
      data.lastFailedAttempt ? new Date(data.lastFailedAttempt) : undefined,
      data.lockExpiresAt ? new Date(data.lockExpiresAt) : undefined,
      new Date(data.createdAt),
      new Date(data.updatedAt),
    );
  }

  toPersistence(): any {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      isLocked: this.isLocked,
      failedAttempts: this.failedAttempts,
      lastLogin: this.lastLogin,
      lastFailedAttempt: this.lastFailedAttempt,
      lockExpiresAt: this.lockExpiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  incrementFailedAttempts(): void {
    this.failedAttempts += 1;
    this.lastFailedAttempt = new Date();
    this.updatedAt = new Date();
  }

  resetFailedAttempts(): void {
    this.failedAttempts = 0;
    this.lastFailedAttempt = undefined;
    this.lockExpiresAt = undefined;
    this.isLocked = false;
    this.updatedAt = new Date();
  }

  lock(lockDuration: number = 30 * 60 * 1000): void {
    this.isLocked = true;
    this.lockExpiresAt = new Date(Date.now() + lockDuration);
    this.updatedAt = new Date();
  }

  unlock(): void {
    this.isLocked = false;
    this.lockExpiresAt = undefined;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  isLockExpired(): boolean {
    if (!this.lockExpiresAt) return false;
    return Date.now() > this.lockExpiresAt.getTime();
  }

  canAttemptLogin(): boolean {
    if (!this.isActive) return false;
    if (this.isLocked && !this.isLockExpired()) return false;
    return true;
  }
} 