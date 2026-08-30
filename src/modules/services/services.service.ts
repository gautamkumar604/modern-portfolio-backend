import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid service ID format');
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async checkTitleUniqueness(
    title: string,
    excludeId?: string,
  ): Promise<void> {
    const trimmedTitle = title.trim();
    const query: any = {
      title: { $regex: `^${this.escapeRegex(trimmedTitle)}$`, $options: 'i' },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await this.serviceModel.findOne(query).exec();
    if (existing) {
      throw new ConflictException('Service with this title already exists');
    }
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    await this.checkTitleUniqueness(createServiceDto.title);

    const data = {
      ...createServiceDto,
      title: createServiceDto.title.trim(),
      shortDescription: createServiceDto.shortDescription.trim(),
      displayOrder: createServiceDto.displayOrder ?? 0,
      isActive: createServiceDto.isActive ?? true,
      features: createServiceDto.features ?? [],
    };

    const newService = new this.serviceModel(data);
    return newService.save();
  }

  async findAllPublic() {
    const data = await this.serviceModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, title: 1 })
      .exec();

    return {
      data,
      total: data.length,
    };
  }

  async findAllAdmin(queryDto: ServiceQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      filter.title = {
        $regex: this.escapeRegex(queryDto.search.trim()),
        $options: 'i',
      };
    }

    if (queryDto.isActive !== undefined) {
      filter.isActive = queryDto.isActive;
    }

    const [data, total] = await Promise.all([
      this.serviceModel
        .find(filter)
        .sort({ displayOrder: 1, title: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.serviceModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Service> {
    this.validateObjectId(id);
    const item = await this.serviceModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Service not found');
    }
    return item;
  }

  async updateAdmin(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    this.validateObjectId(id);

    const existing = await this.serviceModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Service not found');
    }

    if (updateServiceDto.title && updateServiceDto.title.trim() !== existing.title) {
      await this.checkTitleUniqueness(updateServiceDto.title, id);
    }

    const updateData: any = { ...updateServiceDto };
    if (updateServiceDto.title) {
      updateData.title = updateServiceDto.title.trim();
    }
    if (updateServiceDto.shortDescription) {
      updateData.shortDescription = updateServiceDto.shortDescription.trim();
    }

    const updated = await this.serviceModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Service not found');
    }

    return updated;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Service not found');
    }
    return { message: 'Service deleted successfully' };
  }
}
