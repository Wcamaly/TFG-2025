export type NotificationType = 'email' | 'push' | 'sms';

export type NotificationChannel = 'user-notifications' | 'system-notifications';

export type NotificationTemplate = 
  | 'welcome'
  | 'password-reset'
  | 'password-changed'
  | 'account-locked'
  | 'login-alert';

export interface NotificationData {
  [key: string]: any;
}

export interface NotificationPayload {
  type: NotificationType;
  channel: NotificationChannel;
  template: NotificationTemplate;
  data: NotificationData;
  metadata?: Record<string, any>;
} 