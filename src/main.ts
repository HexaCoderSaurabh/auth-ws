// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: `env/${process.env.STAGE}.auth.env`
});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Authentication Endpoints')
    .setDescription('All the available endpoints for authentication')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port || 4000);
  logger.log(`App running in port ${port}`);
}
bootstrap();
