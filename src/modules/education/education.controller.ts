import { Controller, Get } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAllPublic() {
    return this.educationService.findAllPublic();
  }
}
