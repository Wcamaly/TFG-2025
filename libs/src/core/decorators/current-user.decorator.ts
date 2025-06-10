import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedEntity } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  <T extends AuthenticatedEntity & Record<string, any> = AuthenticatedEntity & Record<string, any>>(
    data: keyof T | undefined, 
    ctx: ExecutionContext
  ): T | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si se especifica un property, devolver solo ese campo
    return data ? user?.[data] : user;
  },
); 