import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Just implemented this to apply debugger. We can remove this from here as well
  async canActivate(context: ExecutionContext) {
    const result: boolean = (await super.canActivate(context)) as boolean;

    return result;
  }
}
