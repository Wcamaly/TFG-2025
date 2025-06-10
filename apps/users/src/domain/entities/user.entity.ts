// Domain enum - independent of infrastructure
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _name: string,
    private _password: string,
    private readonly _role: UserRole,
    private _isActive: boolean,
    private _isLocked: boolean,
    private _failedAttempts: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _lastLogin?: Date,
  ) {}

  // Getters
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get name(): string { return this._name; }
  get password(): string { return this._password; }
  get role(): UserRole { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get isLocked(): boolean { return this._isLocked; }
  get failedAttempts(): number { return this._failedAttempts; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get lastLogin(): Date | undefined { return this._lastLogin; }

  // Factory method for creating new users
  static create(
    id: string,
    email: string,
    name: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): User {
    const now = new Date();
    return new User(
      id,
      email,
      name,
      password,
      role,
      true, // isActive
      false, // isLocked
      0, // failedAttempts
      now, // createdAt
      now, // updatedAt
    );
  }

  // Factory method for reconstructing from persistence
  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    isLocked: boolean;
    failedAttempts: number;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.password,
      data.role,
      data.isActive,
      data.isLocked,
      data.failedAttempts,
      data.createdAt,
      data.updatedAt,
      data.lastLogin,
    );
  }

  // Business logic methods
  canLogin(): boolean {
    return this._isActive && !this._isLocked;
  }

  changePassword(newPassword: string): void {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  incrementFailedAttempts(): void {
    this._failedAttempts += 1;
    this._updatedAt = new Date();
  }

  resetFailedAttempts(): void {
    this._failedAttempts = 0;
    this._isLocked = false;
    this._updatedAt = new Date();
  }

  shouldBeLocked(): boolean {
    return this._failedAttempts >= 5;
  }

  lockAccount(): void {
    this._isLocked = true;
    this._updatedAt = new Date();
  }

  unlockAccount(): void {
    this._isLocked = false;
    this._failedAttempts = 0;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  updateLastLogin(): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }

  // Domain validation methods
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  static isValidName(name: string): boolean {
    return name.length >= 2 && name.trim().length > 0;
  }

  // Domain invariants
  private validateInvariants(): void {
    if (!User.isValidEmail(this._email)) {
      throw new Error('Invalid email format');
    }
    if (!User.isValidName(this._name)) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (!User.isValidPassword(this._password)) {
      throw new Error('Password must be at least 6 characters long');
    }
  }
} 