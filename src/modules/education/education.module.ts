import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Education, EducationSchema } from './schemas/education.schema';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { AdminEducationController } from './admin-education.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Education.name, schema: EducationSchema },
    ]),
    AuthModule,
  ],
  controllers: [EducationController, AdminEducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
