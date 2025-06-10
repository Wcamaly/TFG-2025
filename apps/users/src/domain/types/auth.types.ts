import { JwtPayload, AuthenticatedEntity } from '@core/interfaces/jwt-payload.interface';
import { UserRole } from '../entities/user.entity';

// Payload específico para usuarios
export interface UserJwtPayload extends JwtPayload<UserTokenData> {
  sub: string; // user id
  data: UserTokenData; // datos del usuario
}

// Datos específicos del usuario en el token
export interface UserTokenData {
  email: string;
  name: string;
  role: UserRole;
}

// Usuario autenticado con datos completos
export interface AuthenticatedUser extends AuthenticatedEntity {
  id: string; // Asegurar que id está presente
  email: string;
  name: string;
  role: UserRole;
} 