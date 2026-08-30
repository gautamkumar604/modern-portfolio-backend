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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceQueryDto } from './dto/experience-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin/experience')
export class AdminExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAllAdmin(@Query() queryDto: ExperienceQueryDto) {
    return this.experienceService.findAllAdmin(queryDto);
  }

  @Get(':id')
  async findByIdAdmin(@Param('id') id: string) {
    return this.experienceService.findByIdAdmin(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAdmin(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.updateAdmin(id, updateExperienceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.experienceService.deleteAdmin(id);
  }
}
