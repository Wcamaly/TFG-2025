export class BookingQuota {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly total: number,
    public readonly remaining: number,
    public readonly validFrom: Date,
    public readonly validUntil: Date,
    public readonly paymentId: string,
  ) {}

  public static create(
    userId: string,
    total: number,
    validFrom: Date,
    validUntil: Date,
    paymentId: string,
  ): BookingQuota {
    return new BookingQuota(
      crypto.randomUUID(),
      userId,
      total,
      total,
      validFrom,
      validUntil,
      paymentId,
    );
  }

  public consume(): BookingQuota {
    if (this.remaining <= 0) {
      throw new Error('No remaining quotas available');
    }

    if (this.isExpired()) {
      throw new Error('Quota has expired');
    }

    return new BookingQuota(
      this.id,
      this.userId,
      this.total,
      this.remaining - 1,
      this.validFrom,
      this.validUntil,
      this.paymentId,
    );
  }

  public refund(): BookingQuota {
    if (this.remaining >= this.total) {
      throw new Error('Cannot refund more quotas than the total');
    }

    return new BookingQuota(
      this.id,
      this.userId,
      this.total,
      this.remaining + 1,
      this.validFrom,
      this.validUntil,
      this.paymentId,
    );
  }

  public isExpired(): boolean {
    return new Date() > this.validUntil;
  }

  public isValid(): boolean {
    const now = new Date();
    return now >= this.validFrom && now <= this.validUntil && this.remaining > 0;
  }
} 