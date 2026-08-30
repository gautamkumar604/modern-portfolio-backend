import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Profile, ProfileDocument } from '../modules/profile/schemas/profile.schema';

async function bootstrap() {
  const logger = new Logger('ProfileSeed');
  logger.log('Starting profile seed script...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const profileModel = app.get<Model<ProfileDocument>>(
      getModelToken(Profile.name),
    );

    const existingProfile = await profileModel.findOne().exec();
    if (existingProfile) {
      logger.log(
        `Profile document already exists (${existingProfile.name}). Skipping seed creation.`,
      );
      await app.close();
      process.exit(0);
    }

    const name = process.env.PROFILE_NAME || 'Gautam Kumar';
    const title = process.env.PROFILE_TITLE || 'Full-Stack Software Engineer';
    const email = process.env.PROFILE_EMAIL || 'gautam@portfolio.com';
    const shortBio =
      process.env.PROFILE_SHORT_BIO ||
      'Passionate software engineer building scalable web applications with NestJS, Next.js, and TypeScript.';

    const initialProfile = new profileModel({
      name,
      title,
      heroGreeting: "Hello, I'm",
      heroHeadline: 'Building scalable web & cloud applications',
      heroSubtitle:
        'Full-Stack Software Engineer specializing in NestJS and Next.js',
      primaryCtaText: 'View Work',
      primaryCtaUrl: '/#projects',
      secondaryCtaText: 'Contact Me',
      secondaryCtaUrl: '/#contact',
      shortBio,
      detailedBio:
        'Software Engineer with experience in developing production-grade web applications, REST APIs, and database architectures.',
      location: 'India',
      email,
      availabilityStatus: 'available',
      yearsOfExperience: 3,
      highlights: [
        'Production REST API architectures with NestJS & MongoDB',
        'Modern dynamic Next.js frontend user experiences',
      ],
    });

    await initialProfile.save();

    logger.log(`Initial profile document created successfully for ${name}.`);
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error encountered while seeding profile:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
