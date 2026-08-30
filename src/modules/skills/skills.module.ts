import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schemas/skill.schema';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { AdminSkillsController } from './admin-skills.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
    AuthModule,
  ],
  controllers: [SkillsController, AdminSkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
