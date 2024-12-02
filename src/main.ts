// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: `env/${process.env.STAGE}.auth.env`
});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Authentication Endpoints')
    .setDescription('All the available endpoints for authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port || 4001);
  logger.log(`App running in port ${port}`);
}
bootstrap();
