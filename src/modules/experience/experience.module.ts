import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { AdminExperienceController } from './admin-experience.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
    AuthModule,
  ],
  controllers: [ExperienceController, AdminExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
