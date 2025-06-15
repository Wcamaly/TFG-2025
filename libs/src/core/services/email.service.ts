export interface EmailService {
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE'); 