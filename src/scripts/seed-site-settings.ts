import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import {
  SiteSetting,
  SiteSettingDocument,
} from '../modules/site-settings/schemas/site-setting.schema';

async function bootstrap() {
  const logger = new Logger('SiteSettingsSeed');
  logger.log('Starting site settings seed script...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const siteSettingModel = app.get<Model<SiteSettingDocument>>(
      getModelToken(SiteSetting.name),
    );

    const existingSettings = await siteSettingModel.findOne().exec();
    if (existingSettings) {
      logger.log('Site settings document already exists. Skipping seed.');
      await app.close();
      process.exit(0);
    }

    const siteName = process.env.SITE_NAME || 'Portfolio CMS';
    const tagline =
      process.env.SITE_TAGLINE || 'Building modern web applications';
    const defaultSeoTitle =
      process.env.SITE_DEFAULT_SEO_TITLE || 'Portfolio - Full-Stack Developer';
    const defaultSeoDescription =
      process.env.SITE_DEFAULT_SEO_DESCRIPTION ||
      'Official developer portfolio showcasing projects, skills, and experience.';
    const contactEmail =
      process.env.SITE_CONTACT_EMAIL || 'contact@portfolio.com';
    const footerText =
      process.env.SITE_FOOTER_TEXT || 'Built with NestJS and Next.js';
    const copyrightText =
      process.env.SITE_COPYRIGHT_TEXT ||
      '© 2026 Gautam Kumar. All rights reserved.';

    const initialSettings = new siteSettingModel({
      siteName,
      tagline,
      defaultSeoTitle,
      defaultSeoDescription,
      keywords: ['portfolio', 'developer', 'full-stack', 'nestjs', 'nextjs'],
      contactEmail,
      footerText,
      copyrightText,
      isMaintenanceMode: false,
    });

    await initialSettings.save();

    logger.log('Initial site settings document created successfully.');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error encountered while seeding site settings:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
