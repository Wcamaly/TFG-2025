export class TrainerOffert {
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly durationInDays: number,
    public readonly includesBookings: boolean,
    public readonly bookingQuota: number | null,
    public readonly createdAt: Date,
    public readonly isActive: boolean,
  ) {}

  public static create(
    trainerId: string,
    title: string,
    description: string,
    price: number,
    currency: string,
    durationInDays: number,
    includesBookings: boolean,
    bookingQuota: number | null,
  ): TrainerOffert {
    return new TrainerOffert(
      crypto.randomUUID(),
      trainerId,
      title,
      description,
      price,
      currency,
      durationInDays,
      includesBookings,
      bookingQuota,
      new Date(),
      true,
    );
  }

  public deactivate(): TrainerOffert {
    return new TrainerOffert(
      this.id,
      this.trainerId,
      this.title,
      this.description,
      this.price,
      this.currency,
      this.durationInDays,
      this.includesBookings,
      this.bookingQuota,
      this.createdAt,
      false,
    );
  }

  public activate(): TrainerOffert {
    return new TrainerOffert(
      this.id,
      this.trainerId,
      this.title,
      this.description,
      this.price,
      this.currency,
      this.durationInDays,
      this.includesBookings,
      this.bookingQuota,
      this.createdAt,
      true,
    );
  }

  public update(
    title?: string,
    description?: string,
    price?: number,
    currency?: string,
    durationInDays?: number,
    includesBookings?: boolean,
    bookingQuota?: number | null,
  ): TrainerOffert {
    return new TrainerOffert(
      this.id,
      this.trainerId,
      title ?? this.title,
      description ?? this.description,
      price ?? this.price,
      currency ?? this.currency,
      durationInDays ?? this.durationInDays,
      includesBookings ?? this.includesBookings,
      bookingQuota ?? this.bookingQuota,
      this.createdAt,
      this.isActive,
    );
  }
} 