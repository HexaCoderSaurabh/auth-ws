import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async login(user: User) {
    const { email, username, firstName, lastName } = user;
    return this.getToken({ email, username, firstName, lastName });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
      });

      const refreshTokenDB = await this.redisService.getRefreshToken(
        payload?.username
      );

      if (payload && refreshTokenDB === refreshToken) {
        const { email, username, firstName, lastName } = payload;
        return this.getToken({ email, username, firstName, lastName });
      }

      throw new Error('Invalid refresh token');
    } catch (e) {
      throw new Error('Error while refreshing tokens');
    }
  }

  getToken(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '1h'
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '7d'
    });
    this.redisService.saveRefreshToken(payload.email, refreshToken);
    return { accessToken, refreshToken };
  }
}
