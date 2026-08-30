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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillQueryDto } from './dto/skill-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin/skills')
export class AdminSkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAllAdmin(@Query() queryDto: SkillQueryDto) {
    return this.skillsService.findAllAdmin(queryDto);
  }

  @Get(':id')
  async findByIdAdmin(@Param('id') id: string) {
    return this.skillsService.findByIdAdmin(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAdmin(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.updateAdmin(id, updateSkillDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.skillsService.deleteAdmin(id);
  }
}
