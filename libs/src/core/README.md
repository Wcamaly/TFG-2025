# Core Authentication Module

Este módulo proporciona componentes comunes de autenticación JWT para todos los microservicios.

## Componentes

### Guards
- **JwtAuthGuard**: Valida tokens JWT y extrae información del usuario

### Decorators
- **@CurrentUser()**: Extrae el usuario autenticado del request
- **@CurrentUser('id')**: Extrae solo el ID del usuario

### Services
- **BcryptPasswordHashingService**: Servicio común para hash de contraseñas

### Interfaces
- **JwtPayload**: Estructura del payload del token JWT
- **AuthenticatedUser**: Información del usuario autenticado
- **PasswordHashingService**: Interfaz para servicios de hash

## Uso

### 1. Importar el CoreModule

```typescript
import { CoreModule } from '@core';

@Module({
  imports: [
    CoreModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class YourModule {}
```

### 2. Proteger endpoints

```typescript
import { JwtAuthGuard, CurrentUser, AuthenticatedUser } from '@core';

@Controller('protected')
export class ProtectedController {
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return { message: `Hello ${user.name}` };
  }
  
  @Get('user-id')
  @UseGuards(JwtAuthGuard)
  async getUserId(@CurrentUser('id') userId: string) {
    return { userId };
  }
}
```

### 3. Generar tokens

```typescript
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@core';

// Definir tipos específicos de tu dominio
interface MyEntityData {
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  
  async generateToken(entity: MyEntity): Promise<string> {
    const payload: JwtPayload<MyEntityData> = {
      sub: entity.id,
      data: {
        email: entity.email,
        name: entity.name,
        role: entity.role,
      },
    };
    
    return this.jwtService.signAsync(payload);
  }
}
```

## Variables de entorno

```env
JWT_SECRET=your-super-secret-key-here
```

## Estructura del Token

```json
{
  "sub": "entity-id",
  "data": {
    "email": "user@example.com", 
    "name": "User Name",
    "role": "USER"
  },
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Headers de autenticación

```
Authorization: Bearer <jwt-token>
``` 