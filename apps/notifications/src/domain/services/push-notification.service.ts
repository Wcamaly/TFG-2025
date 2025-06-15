export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  icon?: string;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal' | 'low';
  ttl?: number;
  channelId?: string;
}

export interface PushNotificationOptions {
  tokens: string | string[];
  topic?: string;
  condition?: string;
  collapseKey?: string;
  mutableContent?: boolean;
  contentAvailable?: boolean;
}

export interface PushNotificationService {
  sendNotification(options: PushNotificationOptions, payload: PushNotificationPayload): Promise<void>;
  subscribeToTopic(tokens: string | string[], topic: string): Promise<void>;
  unsubscribeFromTopic(tokens: string | string[], topic: string): Promise<void>;
  sendMulticast(options: PushNotificationOptions, payload: PushNotificationPayload): Promise<void>;
  sendToTopic(topic: string, payload: PushNotificationPayload): Promise<void>;
}

export const PUSH_NOTIFICATION_SERVICE = Symbol('PUSH_NOTIFICATION_SERVICE'); 