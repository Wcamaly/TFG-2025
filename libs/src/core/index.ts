// Module
export * from './core.module';
export * from './auth/auth.module';

// Guards
export * from './guards/jwt-auth.guard';

// Decorators
export * from './decorators/current-user.decorator';

// Services
export * from './services/bcrypt-password-hashing.service';

// Interfaces and Constants
export * from './interfaces/jwt-payload.interface';
export * from './interfaces/password-hashing.interface';
export * from './interfaces/jwt-token.service';
export * from './interfaces/password-recovery.service';

// Export constants explicitly to ensure they're available
export { PASSWORD_HASHING_SERVICE } from './interfaces/password-hashing.interface';
export { JWT_TOKEN_SERVICE } from './interfaces/jwt-token.service';
export { PASSWORD_RECOVERY_SERVICE } from './interfaces/password-recovery.service';

// Types - Note: express.d.ts is included via imports, not exported

// Existing exports
export * from './base-main';
export * from './middleware/correlation-id.middleware';
export * from './filters/http-exception.filter';
export * from './pipes/validation.pipe';
export * from './interceptors/transform.interceptor';
export * from './swagger/set-swagger'; 