export const REDIS_PATTERNS = {
  // Eventos de suscripción
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_EXPIRED: 'subscription.expired',

  // Eventos de oferta
  OFFERT_CREATED: 'offert.created',
  OFFERT_UPDATED: 'offert.updated',
  OFFERT_DEACTIVATED: 'offert.deactivated',

  // Eventos de reserva
  BOOKING_CREATED: 'booking.created',
  BOOKING_CANCELLED: 'booking.cancelled',
  BOOKING_COMPLETED: 'booking.completed',

  // Eventos de pago
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_STATUS_CHANGED: 'payment.status.changed',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',

  // Eventos de usuario
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DEACTIVATED: 'user.deactivated',

  // Eventos de gimnasio
  GYM_CREATED: 'gym.created',
  GYM_UPDATED: 'gym.updated',
  GYM_DEACTIVATED: 'gym.deactivated',
} as const; 