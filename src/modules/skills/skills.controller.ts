import { Controller, Get, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillQueryDto } from './dto/skill-query.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAllPublic(@Query() queryDto: SkillQueryDto) {
    return this.skillsService.findAllPublic(queryDto);
  }
}
