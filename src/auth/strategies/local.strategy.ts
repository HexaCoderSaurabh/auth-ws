import { User } from '@entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByIdOrUsername(username);
    if (!user) {
      throw new UnauthorizedException('No Such User Found!');
    }
    const valid: boolean = await this.userService.verifyPassword(
      username,
      password
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    return user;
  }
}
