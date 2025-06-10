// Interfaz base genérica para JWT payload
export interface BaseJwtPayload {
  sub: string; // entity id
  iat?: number; // issued at
  exp?: number; // expiration time
}

// Interfaz extendible para payloads con datos adicionales
export interface JwtPayload<T = Record<string, any>> extends BaseJwtPayload {
  data?: T; // datos específicos del dominio
}

// Interfaz base para entidades autenticadas
export interface AuthenticatedEntity {
  id: string;
}

// Ejemplo de tipo específico - los servicios deben definir el suyo propio
export type CoreAuthenticatedUser = AuthenticatedEntity & {
  email: string;
  name: string;
  role: string;
}; 