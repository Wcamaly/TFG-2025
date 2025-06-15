export const EMAIL_TEMPLATES = {
  WELCOME: (name: string) => ({
    subject: 'Welcome to our platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; text-align: center;">Welcome to our platform!</h1>
        <p style="color: #34495e; font-size: 16px;">Hello ${name},</p>
        <p style="color: #34495e; font-size: 16px;">Thank you for registering. Your account has been created successfully.</p>
        <p style="color: #34495e; font-size: 16px;">You can now log in using your email and password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/login" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Go to Login
          </a>
        </div>
        <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
          If you have any questions, please don't hesitate to contact our support team.
        </p>
      </div>
    `
  }),

  PASSWORD_RESET: (resetToken: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; text-align: center;">Password Reset Request</h1>
        <p style="color: #34495e; font-size: 16px;">You have requested to reset your password.</p>
        <p style="color: #34495e; font-size: 16px;">Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
             style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p style="color: #7f8c8d; font-size: 14px;">
          This link will expire in 1 hour for security reasons.
        </p>
        <p style="color: #7f8c8d; font-size: 14px;">
          If you didn't request this, please ignore this email and ensure your account is secure.
        </p>
      </div>
    `
  }),

  PASSWORD_CHANGED: () => ({
    subject: 'Password Changed Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; text-align: center;">Password Changed Successfully</h1>
        <p style="color: #34495e; font-size: 16px;">Your password has been changed successfully.</p>
        <p style="color: #34495e; font-size: 16px;">If you didn't make this change, please contact support immediately.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/support" 
             style="background-color: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Contact Support
          </a>
        </div>
        <p style="color: #7f8c8d; font-size: 14px;">
          For security reasons, we recommend reviewing your account activity.
        </p>
      </div>
    `
  }),

  ACCOUNT_LOCKED: (unlockTime: string) => ({
    subject: 'Account Temporarily Locked',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; text-align: center;">Account Temporarily Locked</h1>
        <p style="color: #34495e; font-size: 16px;">Your account has been temporarily locked due to multiple failed login attempts.</p>
        <p style="color: #34495e; font-size: 16px;">Your account will be unlocked at: ${unlockTime}</p>
        <p style="color: #7f8c8d; font-size: 14px;">
          If you believe this is an error or need immediate assistance, please contact our support team.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/support" 
             style="background-color: #f39c12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Contact Support
          </a>
        </div>
      </div>
    `
  }),

  LOGIN_ALERT: (location: string, device: string) => ({
    subject: 'New Login Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; text-align: center;">New Login Alert</h1>
        <p style="color: #34495e; font-size: 16px;">We detected a new login to your account:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="color: #34495e; font-size: 16px; margin: 5px 0;"><strong>Location:</strong> ${location}</p>
          <p style="color: #34495e; font-size: 16px; margin: 5px 0;"><strong>Device:</strong> ${device}</p>
          <p style="color: #34495e; font-size: 16px; margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p style="color: #7f8c8d; font-size: 14px;">
          If this was you, you can ignore this email. If not, please secure your account immediately.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/security" 
             style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Review Account Security
          </a>
        </div>
      </div>
    `
  })
}; 