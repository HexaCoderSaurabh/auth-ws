import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379
    });
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.redisClient.setex(userId, 3600 * 24 * 7, refreshToken);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return await this.redisClient.get(userId);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.redisClient.del(userId);
  }
}
