import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Serve uploaded files statically
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

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
      forbidNonWhitelisted: false,
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
