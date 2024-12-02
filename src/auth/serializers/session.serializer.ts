import { User } from '@entities/user.entity';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

interface SerializeUserCallback {
  (err: any, user?: { id: string; username: string }): void;
}

interface DeserializeUserCallback {
  (
    err: any,
    user?: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
    }
  ): void;
}

export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: any, done: SerializeUserCallback) {
    const { id, username } = user;
    done(null, { id, username });
  }
  async deserializeUser(payload: any, done: DeserializeUserCallback) {
    const { id, username, email, firstName, lastName }: User =
      await this.userService.findOneByIdOrUsername(payload.username);
    done(null, { id, username, email, firstName, lastName });
  }
}
