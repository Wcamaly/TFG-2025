import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsService, SmsOptions } from '../../domain/services/sms.service';

@Injectable()
export class SmsServiceImpl implements SmsService {
  constructor(private readonly configService: ConfigService) {}

  async sendSms(options: SmsOptions, message: string): Promise<void> {
    // TODO: Implementar lógica de envío de SMS
    console.log('Sending SMS:', { options, message });
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    const message = `Your verification code is: ${code}`;
    await this.sendSms({ to: phoneNumber }, message);
  }

  async sendBookingConfirmation(phoneNumber: string, bookingDetails: any): Promise<void> {
    const message = `Your booking has been confirmed: ${JSON.stringify(bookingDetails)}`;
    await this.sendSms({ to: phoneNumber }, message);
  }

  async sendPaymentConfirmation(phoneNumber: string, paymentDetails: any): Promise<void> {
    const message = `Your payment has been confirmed: ${JSON.stringify(paymentDetails)}`;
    await this.sendSms({ to: phoneNumber }, message);
  }

  async sendAppointmentReminder(phoneNumber: string, appointmentDetails: any): Promise<void> {
    const message = `Reminder: You have an appointment scheduled: ${JSON.stringify(appointmentDetails)}`;
    await this.sendSms({ to: phoneNumber }, message);
  }
} 