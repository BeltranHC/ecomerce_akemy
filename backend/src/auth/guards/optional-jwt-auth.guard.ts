import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Intentar autenticar pero no fallar si no hay token
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // No lanzar error si no hay usuario, simplemente devolver null
    if (err || !user) {
      return null;
    }
    return user;
  }
}
