import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  SESClient, 
  SendEmailCommand,
  SendEmailCommandInput 
} from '@aws-sdk/client-ses';
import { NotificationPayload } from '@core/notifications/notification.types';
import { EMAIL_TEMPLATES } from '../templates/email.templates';

@Injectable()
export class EmailServiceImpl {
  private readonly ses: SESClient;
  private readonly logger = new Logger(EmailServiceImpl.name);
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.ses = new SESClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.fromEmail = this.configService.get('AWS_SES_FROM_EMAIL');
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const input: SendEmailCommandInput = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      };

      const command = new SendEmailCommand(input);
      await this.ses.send(command);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processNotification(notification: NotificationPayload): Promise<void> {
    const { template, data } = notification;

    switch (template) {
      case 'welcome': {
        const emailTemplate = EMAIL_TEMPLATES.WELCOME(data.name);
        await this.sendEmail(data.email, emailTemplate.subject, emailTemplate.html);
        break;
      }

      case 'password-reset': {
        const emailTemplate = EMAIL_TEMPLATES.PASSWORD_RESET(data.resetToken);
        await this.sendEmail(data.email, emailTemplate.subject, emailTemplate.html);
        break;
      }

      case 'password-changed': {
        const emailTemplate = EMAIL_TEMPLATES.PASSWORD_CHANGED();
        await this.sendEmail(data.email, emailTemplate.subject, emailTemplate.html);
        break;
      }

      case 'account-locked': {
        const emailTemplate = EMAIL_TEMPLATES.ACCOUNT_LOCKED(data.unlockTime);
        await this.sendEmail(data.email, emailTemplate.subject, emailTemplate.html);
        break;
      }

      case 'login-alert': {
        const emailTemplate = EMAIL_TEMPLATES.LOGIN_ALERT(data.location, data.device);
        await this.sendEmail(data.email, emailTemplate.subject, emailTemplate.html);
        break;
      }

      default:
        this.logger.warn(`Unknown email template: ${template}`);
        throw new Error(`Unknown email template: ${template}`);
    }
  }
} 