import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectQueryDto } from './dto/project-query.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAllPublic(@Query() queryDto: ProjectQueryDto) {
    return this.projectsService.findAllPublic(queryDto);
  }

  @Get(':slug')
  async findBySlugPublic(@Param('slug') slug: string) {
    return this.projectsService.findBySlugPublic(slug);
  }
}
