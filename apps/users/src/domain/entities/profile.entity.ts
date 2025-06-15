import { Address } from './address.entity';

export class Profile {
  private readonly _id: string;
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _address: Address;
  private _avatar: string;
  private _bio?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: Address,
    avatar: string,
    bio?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._address = address;
    this._avatar = avatar;
    this._bio = bio;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get address(): Address {
    return this._address;
  }

  get avatar(): string {
    return this._avatar;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  update(firstName: string, lastName: string, phoneNumber: string, address: Address, avatar: string, bio?: string): void {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._address = address;
    this._avatar = avatar;
    this._bio = bio;
    this._updatedAt = new Date();
  }

  // Factory method para crear un nuevo perfil
  static create(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: Address,
    avatar: string,
    bio?: string,
  ): Profile {
    return new Profile(
      crypto.randomUUID(),
      firstName,
      lastName,
      phoneNumber,
      address,
      avatar,
      bio,
    );
  }

  // Factory method para reconstruir un perfil desde la persistencia
  static fromPersistence(data: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: Address;
    avatar: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Profile {
    return new Profile(
      data.id,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.address,
      data.avatar,
      data.bio,
      data.createdAt,
      data.updatedAt,
    );
  }
} 