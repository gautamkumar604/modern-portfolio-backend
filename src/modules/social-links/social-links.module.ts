import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialLink, SocialLinkSchema } from './schemas/social-link.schema';
import { SocialLinksService } from './social-links.service';
import { SocialLinksController } from './social-links.controller';
import { AdminSocialLinksController } from './admin-social-links.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialLink.name, schema: SocialLinkSchema },
    ]),
    AuthModule,
  ],
  controllers: [SocialLinksController, AdminSocialLinksController],
  providers: [SocialLinksService],
  exports: [SocialLinksService],
})
export class SocialLinksModule {}
