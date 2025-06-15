import { Profile } from '@/apps/users/src/domain/entities/profile.entity';
import { UserPreferences } from '@/apps/users/src/domain/entities/user-preferences.entity';

// Domain enum - independent of infrastructure
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class User {
  private readonly _id: string;
  private readonly _email: string;
  private _status: UserStatus;
  private _profile?: Profile;
  private _preferences?: UserPreferences;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  _name: string;
  _password: string;
  _role: UserRole;
  _isActive: boolean;
  _isLocked: boolean;
  _failedAttempts: number;
  _lastLogin: Date;

  private constructor(
    id: string,
    email: string,
    status: UserStatus,
    profile?: Profile,
    preferences?: UserPreferences,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._email = email;
    this._status = status;
    this._profile = profile;
    this._preferences = preferences;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this.validateInvariants();
  }

  // Getters
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get status(): UserStatus { return this._status; }
  get profile(): Profile | undefined { return this._profile; }
  get preferences(): UserPreferences | undefined { return this._preferences; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get name(): string { return this._name; }
  get password(): string { return this._password; }
  get role(): UserRole { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get isLocked(): boolean { return this._isLocked; }
  get failedAttempts(): number { return this._failedAttempts; }
  get lastLogin(): Date | undefined { return this._lastLogin; }

  // Factory method for creating new users
  static create(
    id: string,
    email: string,
  ): User {
    return new User(
      id,
      email,
      UserStatus.ACTIVE,
    );
  }

  // Factory method for reconstructing from persistence
  static fromPersistence(data: {
    id: string;
    email: string;
    status: UserStatus;
    profile?: Profile;
    preferences?: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.status,
      data.profile,
      data.preferences,
      data.createdAt,
      data.updatedAt,
    );
  }

  // Business logic methods
  updateStatus(status: UserStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  updateProfile(profile: Profile): void {
    this._profile = profile;
    this._updatedAt = new Date();
  }

  updatePreferences(preferences: UserPreferences): void {
    this._preferences = preferences;
    this._updatedAt = new Date();
  }

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