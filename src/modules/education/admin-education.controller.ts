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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationQueryDto } from './dto/education-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin/education')
export class AdminEducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAllAdmin(@Query() queryDto: EducationQueryDto) {
    return this.educationService.findAllAdmin(queryDto);
  }

  @Get(':id')
  async findByIdAdmin(@Param('id') id: string) {
    return this.educationService.findByIdAdmin(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAdmin(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.create(createEducationDto);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.updateAdmin(id, updateEducationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.educationService.deleteAdmin(id);
  }
}
