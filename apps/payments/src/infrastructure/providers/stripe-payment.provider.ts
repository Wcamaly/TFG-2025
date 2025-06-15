import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { IPaymentProvider, CreatePaymentIntentDto, PaymentIntentResult } from '../../application/ports/payment-provider.port';

@Injectable()
export class StripePaymentProvider implements IPaymentProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'));
  }

  async createPaymentIntent(dto: CreatePaymentIntentDto): Promise<PaymentIntentResult> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100), // Convert to cents
      currency: dto.currency.toLowerCase(),
      metadata: {
        paymentId: dto.paymentId,
      },
    });

    return {
      paymentUrl: paymentIntent.client_secret,
      reference: paymentIntent.id,
    };
  }

  async handleWebhook(payload: any): Promise<{ paymentId: string; status: 'completed' | 'failed' }> {
    const event = this.stripe.webhooks.constructEvent(
      payload.body,
      payload.signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      return {
        paymentId: paymentIntent.metadata.paymentId,
        status: 'completed',
      };
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      return {
        paymentId: paymentIntent.metadata.paymentId,
        status: 'failed',
      };
    }

    throw new Error(`Unhandled event type: ${event.type}`);
  }

  async cancelPayment(reference: string): Promise<void> {
    await this.stripe.paymentIntents.cancel(reference);
  }
} 