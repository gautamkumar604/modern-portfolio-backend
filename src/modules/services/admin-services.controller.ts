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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin/services')
export class AdminServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAllAdmin(@Query() queryDto: ServiceQueryDto) {
    return this.servicesService.findAllAdmin(queryDto);
  }

  @Get(':id')
  async findByIdAdmin(@Param('id') id: string) {
    return this.servicesService.findByIdAdmin(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAdmin(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateAdmin(id, updateServiceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.servicesService.deleteAdmin(id);
  }
}
