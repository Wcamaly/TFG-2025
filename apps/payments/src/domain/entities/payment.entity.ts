export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CARD = 'card',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  ARS = 'ARS',
}

export class Payment {
  toPrisma() {
    throw new Error('Method not implemented.');
  }
  private readonly id: string;
  private readonly userId: string;
  private readonly gymId: string;
  private readonly amount: number;
  private readonly currency: string;
  private readonly provider: string;
  private status: PaymentStatus;
  private providerRef?: string;
  private metadata: Record<string, any>;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: {
    id?: string;
    userId: string;
    gymId: string;
    amount: number;
    currency: string;
    provider: string;
    status: PaymentStatus;
    providerRef?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || crypto.randomUUID();
    this.userId = props.userId;
    this.gymId = props.gymId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.provider = props.provider;
    this.status = props.status;
    this.providerRef = props.providerRef;
    this.metadata = props.metadata || {};
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getGymId(): string {
    return this.gymId;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  getProvider(): string {
    return this.provider;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getProviderRef(): string | undefined {
    return this.providerRef;
  }

  getMetadata(): Record<string, any> {
    return this.metadata;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateStatus(status: PaymentStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  updateProviderRef(providerRef: string): void {
    this.providerRef = providerRef;
    this.updatedAt = new Date();
  }

  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updatedAt = new Date();
  }

  canBeCancelled(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === PaymentStatus.CANCELLED;
  }

  static create(
    userId: string,
    amount: number,
    currency: Currency,
    method: PaymentMethod,
    bookingId?: string,
    trainerId?: string,
    gymId?: string,
  ): Payment {
    return new Payment(
      {
        userId,
        gymId,
        amount,
        currency: currency.toString(),
        provider: method.toString(),
        status: PaymentStatus.PENDING,
      },
    );
  }
} 