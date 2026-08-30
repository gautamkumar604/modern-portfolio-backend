import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Parse cookies
  app.use(cookieParser());

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Configure CORS using environment variable
  const clientOrigin =
    configService.get<string>('CLIENT_ORIGIN') ||
    configService.get<string>('clientOrigin') ||
    'http://localhost:3000';

  app.enableCors({
    origin: clientOrigin,
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port =
    configService.get<number>('PORT') ||
    configService.get<number>('port') ||
    5000;

  await app.listen(port);
  logger.log(`Application is running on port ${port} with prefix /api`);
}

bootstrap();
