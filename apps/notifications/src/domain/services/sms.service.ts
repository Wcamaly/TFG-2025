export interface SmsOptions {
  to: string | string[];
  from?: string;
  messagingServiceSid?: string;
  statusCallback?: string;
  maxPrice?: string;
  provideFeedback?: boolean;
}

export interface SmsService {
  sendSms(options: SmsOptions, message: string): Promise<void>;
  sendVerificationCode(phoneNumber: string, code: string): Promise<void>;
  sendBookingConfirmation(phoneNumber: string, bookingDetails: any): Promise<void>;
  sendPaymentConfirmation(phoneNumber: string, paymentDetails: any): Promise<void>;
  sendAppointmentReminder(phoneNumber: string, appointmentDetails: any): Promise<void>;
}

export const SMS_SERVICE = Symbol('SMS_SERVICE'); 