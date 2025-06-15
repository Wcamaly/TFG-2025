import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class TrainerSubscription {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly offertId: string,
    public readonly validFrom: Date,
    public readonly validUntil: Date,
    public readonly status: SubscriptionStatus,
    public readonly paymentId: string,
    public readonly createdAt: Date,
  ) {}

  public static create(
    userId: string,
    offertId: string,
    validFrom: Date,
    validUntil: Date,
    paymentId: string,
  ): TrainerSubscription {
    return new TrainerSubscription(
      crypto.randomUUID(),
      userId,
      offertId,
      validFrom,
      validUntil,
      SubscriptionStatus.ACTIVE,
      paymentId,
      new Date(),
    );
  }

  public cancel(): TrainerSubscription {
    if (this.status !== SubscriptionStatus.ACTIVE) {
      throw new Error('Cannot cancel a subscription that is not active');
    }

    return new TrainerSubscription(
      this.id,
      this.userId,
      this.offertId,
      this.validFrom,
      this.validUntil,
      SubscriptionStatus.CANCELLED,
      this.paymentId,
      this.createdAt,
    );
  }

  public expire(): TrainerSubscription {
    if (this.status !== SubscriptionStatus.ACTIVE) {
      throw new Error('Cannot expire a subscription that is not active');
    }

    return new TrainerSubscription(
      this.id,
      this.userId,
      this.offertId,
      this.validFrom,
      this.validUntil,
      SubscriptionStatus.EXPIRED,
      this.paymentId,
      this.createdAt,
    );
  }

  public isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  public isExpired(): boolean {
    return this.status === SubscriptionStatus.EXPIRED || new Date() > this.validUntil;
  }
} 