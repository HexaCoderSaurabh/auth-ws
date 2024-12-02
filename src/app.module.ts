import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigValidationSchema } from './config.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomNamingStrategy } from './helper/customNamingStrategy';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    UserModule,
    EmailModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`env/${process.env.STAGE}.auth.env`],
      validationSchema: ConfigValidationSchema,
      cache: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService): Promise<TypeOrmModuleOptions> => {
        const asdf = {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          logging: configService.get('STAGE') === 'dev',
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrations: ['src/database/migrations/*.ts'],
          synchronize: true,
          namingStrategy: new CustomNamingStrategy(),
          extra: {
            dialectOptions: {
              decimalNumbers: true
            }
          }
        };
        return asdf;
      }
    }),
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
