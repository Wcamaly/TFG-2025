export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class PaymentNotFoundError extends PaymentError {
  constructor(id: string) {
    super(`Payment ${id} not found`);
    this.name = 'PaymentNotFoundError';
  }
}

export class UnauthorizedPaymentAccessError extends PaymentError {
  constructor() {
    super('Unauthorized to access this payment');
    this.name = 'UnauthorizedPaymentAccessError';
  }
}

export class PaymentCancellationError extends PaymentError {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentCancellationError';
  }
}

export class PaymentProviderError extends PaymentError {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentProviderError';
  }
} 