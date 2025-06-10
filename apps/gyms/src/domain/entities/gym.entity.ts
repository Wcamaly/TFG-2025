export interface GymLocation {
  latitude: number;
  longitude: number;
}

export interface OpeningHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export class Gym {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly address: string,
    public readonly location: GymLocation,
    public readonly phone: string,
    public readonly email: string,
    public readonly openingHours: OpeningHours,
    public readonly ownerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean = true
  ) {}

  static create(params: {
    id: string;
    name: string;
    description: string;
    address: string;
    location: GymLocation;
    phone: string;
    email: string;
    openingHours: OpeningHours;
    ownerId: string;
  }): Gym {
    const now = new Date();
    return new Gym(
      params.id,
      params.name,
      params.description,
      params.address,
      params.location,
      params.phone,
      params.email,
      params.openingHours,
      params.ownerId,
      now,
      now,
      true
    );
  }

  update(params: {
    name?: string;
    description?: string;
    address?: string;
    location?: GymLocation;
    phone?: string;
    email?: string;
    openingHours?: OpeningHours;
  }): Gym {
    return new Gym(
      this.id,
      params.name ?? this.name,
      params.description ?? this.description,
      params.address ?? this.address,
      params.location ?? this.location,
      params.phone ?? this.phone,
      params.email ?? this.email,
      params.openingHours ?? this.openingHours,
      this.ownerId,
      this.createdAt,
      new Date(),
      this.isActive
    );
  }

  deactivate(): Gym {
    return new Gym(
      this.id,
      this.name,
      this.description,
      this.address,
      this.location,
      this.phone,
      this.email,
      this.openingHours,
      this.ownerId,
      this.createdAt,
      new Date(),
      false
    );
  }

  isOwnedBy(userId: string): boolean {
    return this.ownerId === userId;
  }
} 