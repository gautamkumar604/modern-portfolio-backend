import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

async function bootstrap() {
  const logger = new Logger('AdminSeed');
  logger.log('Starting admin seed script...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    if (!adminEmail || !adminPassword) {
      logger.error(
        'Missing required environment variables: ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be defined in .env.',
      );
      await app.close();
      process.exit(1);
    }

    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    // Check if an admin already exists
    const existingAdmin = await userModel.findOne({ role: 'admin' }).exec();
    if (existingAdmin) {
      logger.log(
        `Admin user already exists (${existingAdmin.email}). Skipping seed creation.`,
      );
      await app.close();
      process.exit(0);
    }

    // Check if user with this email exists
    const existingEmail = await userModel
      .findOne({ email: adminEmail.toLowerCase() })
      .exec();
    if (existingEmail) {
      logger.log(
        `User with email ${adminEmail} already exists. Skipping seed creation.`,
      );
      await app.close();
      process.exit(0);
    }

    // Hash password with salt rounds 10
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = new userModel({
      name: 'Portfolio Admin',
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    await admin.save();

    logger.log(
      `Initial admin user created successfully with email: ${adminEmail.toLowerCase()}`,
    );
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error encountered while seeding admin user:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
