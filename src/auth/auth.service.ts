import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const { email, username, firstName, lastName } = user;

    const accessToken = this.jwtService.sign(
      { email, username, firstName, lastName },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '1h',
      },
    );

    return { accessToken };
  }
}
