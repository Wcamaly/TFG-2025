import { Currency } from '../../domain/entities/payment.entity';

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface CreatePaymentIntentDto {
  amount: number;
  currency: Currency;
  paymentId: string;
}

export interface PaymentIntentResult {
  paymentUrl: string;
  reference: string;
}

export interface IPaymentProvider {
  createPaymentIntent(dto: CreatePaymentIntentDto): Promise<PaymentIntentResult>;
  handleWebhook(payload: any): Promise<{ paymentId: string; status: 'completed' | 'failed' }>;
  cancelPayment(reference: string): Promise<void>;
} 