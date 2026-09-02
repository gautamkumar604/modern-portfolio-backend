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

  // Set standard HTTP security headers
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Configure CORS using environment variable & local dev fallbacks
  const rawClientOrigin =
    configService.get<string>('CLIENT_ORIGIN') ||
    configService.get<string>('clientOrigin') ||
    'http://localhost:3000';
  const configuredOrigin = rawClientOrigin.replace(/\/+$/, '');

  const allowedOrigins = [
    configuredOrigin,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.startsWith('http://localhost:') ||
        cleanOrigin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, cleanOrigin);
    },
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
