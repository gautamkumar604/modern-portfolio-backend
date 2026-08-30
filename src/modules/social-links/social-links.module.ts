import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialLink, SocialLinkSchema } from './schemas/social-link.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialLink.name, schema: SocialLinkSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SocialLinksModule {}
