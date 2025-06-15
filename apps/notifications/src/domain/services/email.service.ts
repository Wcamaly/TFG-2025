export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: any;
    contentType?: string;
  }>;
}

export interface EmailService {
  sendEmail(options: EmailOptions, template: EmailTemplate): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendBookingConfirmationEmail(email: string, bookingDetails: any): Promise<void>;
  sendPaymentConfirmationEmail(email: string, paymentDetails: any): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE'); 