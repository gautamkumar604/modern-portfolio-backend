import { Controller, Get } from '@nestjs/common';
import { ExperienceService } from './experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAllPublic() {
    return this.experienceService.findAllPublic();
  }
}
