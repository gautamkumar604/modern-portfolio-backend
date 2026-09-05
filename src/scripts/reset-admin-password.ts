import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

async function bootstrap() {
  const logger = new Logger('AdminReset');
  logger.log('Starting admin password reset script...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const newPassword = process.argv[2] || process.env.ADMIN_INITIAL_PASSWORD;

    if (!adminEmail || !newPassword) {
      logger.error(
        'Missing required credentials. Set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD in .env or run: npm run reset:admin <newPassword>',
      );
      await app.close();
      process.exit(1);
    }

    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    // Find admin user by role or email
    let admin = await userModel.findOne({ role: 'admin' }).exec();
    if (!admin) {
      admin = await userModel.findOne({ email: adminEmail.toLowerCase() }).exec();
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (admin) {
      admin.passwordHash = passwordHash;
      admin.email = adminEmail.toLowerCase();
      admin.isActive = true;
      await admin.save();
      logger.log(`Admin password reset successfully for email: ${admin.email}`);
    } else {
      // If admin doesn't exist, create new admin
      admin = new userModel({
        name: 'Portfolio Admin',
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      logger.log(`Admin user created with email: ${adminEmail.toLowerCase()}`);
    }

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error encountered while resetting admin password:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
