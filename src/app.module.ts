import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { EducationModule } from './modules/education/education.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ServicesModule } from './modules/services/services.module';
import { SocialLinksModule } from './modules/social-links/social-links.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGO_URI') ||
          configService.get<string>('mongoUri');

        if (!uri) {
          throw new Error(
            'MongoDB connection string (MONGO_URI) is missing from environment configuration.',
          );
        }

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    HealthModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    EducationModule,
    ExperienceModule,
    SkillsModule,
    ProjectsModule,
    ServicesModule,
    SocialLinksModule,
    MessagesModule,
    SiteSettingsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}