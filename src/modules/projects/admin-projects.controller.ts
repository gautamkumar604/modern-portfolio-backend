import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAllAdmin(@Query() queryDto: ProjectQueryDto) {
    return this.projectsService.findAllAdmin(queryDto);
  }

  @Get(':id')
  async findByIdAdmin(@Param('id') id: string) {
    return this.projectsService.findByIdAdmin(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAdmin(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateAdmin(id, updateProjectDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.projectsService.deleteAdmin(id);
  }
}
