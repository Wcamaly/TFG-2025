import { TrainerSpecialty } from '../value-objects/trainer-specialty.vo';
import { TrainerLanguage } from '../value-objects/trainer-language.vo';
import { TrainerAvailability } from '../value-objects/trainer-availability.vo';
import { TrainerRating } from '../value-objects/trainer-rating.vo';
import { Money } from '../value-objects/money.vo';

/**
 * Trainer domain entity following DDD principles
 * Represents a personal trainer with their professional profile
 */
export class Trainer {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _bio: string | null,
    private _specialties: TrainerSpecialty[],
    private _languages: TrainerLanguage[],
    private _rating: TrainerRating | null,
    private _pricePerSession: Money | null,
    private _availableTimes: TrainerAvailability,
    private _isActive: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _metadata: Record<string, any>
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get bio(): string | null {
    return this._bio;
  }

  get specialties(): TrainerSpecialty[] {
    return [...this._specialties];
  }

  get languages(): TrainerLanguage[] {
    return [...this._languages];
  }

  get rating(): TrainerRating | null {
    return this._rating;
  }

  get pricePerSession(): Money | null {
    return this._pricePerSession;
  }

  get availableTimes(): TrainerAvailability {
    return this._availableTimes;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  // Business methods
  updateBio(bio: string): void {
    if (bio.trim().length < 10) {
      throw new Error('Bio must be at least 10 characters long');
    }
    if (bio.length > 1000) {
      throw new Error('Bio cannot exceed 1000 characters');
    }
    this._bio = bio.trim();
    this._updatedAt = new Date();
  }

  addSpecialty(specialty: TrainerSpecialty): void {
    if (this._specialties.some(s => s.equals(specialty))) {
      throw new Error('Specialty already exists');
    }
    if (this._specialties.length >= 10) {
      throw new Error('Maximum 10 specialties allowed');
    }
    this._specialties.push(specialty);
    this._updatedAt = new Date();
  }

  removeSpecialty(specialty: TrainerSpecialty): void {
    this._specialties = this._specialties.filter(s => !s.equals(specialty));
    this._updatedAt = new Date();
  }

  addLanguage(language: TrainerLanguage): void {
    if (this._languages.some(l => l.equals(language))) {
      throw new Error('Language already exists');
    }
    this._languages.push(language);
    this._updatedAt = new Date();
  }

  removeLanguage(language: TrainerLanguage): void {
    if (this._languages.length === 1) {
      throw new Error('At least one language is required');
    }
    this._languages = this._languages.filter(l => !l.equals(language));
    this._updatedAt = new Date();
  }

  updatePricePerSession(price: Money): void {
    if (price.amount <= 0) {
      throw new Error('Price must be greater than zero');
    }
    this._pricePerSession = price;
    this._updatedAt = new Date();
  }

  updateAvailability(availability: TrainerAvailability): void {
    this._availableTimes = availability;
    this._updatedAt = new Date();
  }

  updateRating(rating: TrainerRating): void {
    this._rating = rating;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  isAvailableFor(requestedTime: Date): boolean {
    return this._availableTimes.isAvailableAt(requestedTime);
  }

  hasSpecialty(specialty: TrainerSpecialty): boolean {
    return this._specialties.some(s => s.equals(specialty));
  }

  speaksLanguage(language: TrainerLanguage): boolean {
    return this._languages.some(l => l.equals(language));
  }

  // Factory method
  static create(
    id: string,
    userId: string,
    bio: string | null = null,
    specialties: TrainerSpecialty[] = [],
    languages: TrainerLanguage[] = [],
    pricePerSession: Money | null = null,
    availableTimes: TrainerAvailability = new TrainerAvailability({}),
    metadata: Record<string, any> = {}
  ): Trainer {
    if (languages.length === 0) {
      throw new Error('At least one language is required');
    }

    return new Trainer(
      id,
      userId,
      bio,
      specialties,
      languages,
      null, // rating starts as null
      pricePerSession,
      availableTimes,
      true, // isActive starts as true
      new Date(),
      new Date(),
      metadata
    );
  }
} 