import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Experience, ExperienceDocument } from './schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceQueryDto } from './dto/experience-query.dto';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid experience ID format');
    }
  }

  private validateDates(
    startDate?: string | Date,
    endDate?: string | Date,
  ): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        throw new BadRequestException('Start date cannot be after end date');
      }
    }
  }

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    this.validateDates(createExperienceDto.startDate, createExperienceDto.endDate);

    const data = {
      ...createExperienceDto,
      employmentType: createExperienceDto.employmentType ?? 'full-time',
      isCurrentlyWorking: createExperienceDto.isCurrentlyWorking ?? false,
      displayOrder: createExperienceDto.displayOrder ?? 0,
      responsibilities: createExperienceDto.responsibilities ?? [],
      technologies: createExperienceDto.technologies ?? [],
      achievements: createExperienceDto.achievements ?? [],
    };

    const newExperience = new this.experienceModel(data);
    return newExperience.save();
  }

  async findAllPublic() {
    const data = await this.experienceModel
      .find()
      .sort({ displayOrder: 1, startDate: -1 })
      .exec();

    return {
      data,
      total: data.length,
    };
  }

  async findAllAdmin(queryDto: ExperienceQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      const searchRegex = { $regex: queryDto.search.trim(), $options: 'i' };
      filter.$or = [{ company: searchRegex }, { position: searchRegex }];
    }

    if (queryDto.employmentType) {
      filter.employmentType = queryDto.employmentType;
    }

    const [data, total] = await Promise.all([
      this.experienceModel
        .find(filter)
        .sort({ displayOrder: 1, startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.experienceModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Experience> {
    this.validateObjectId(id);
    const item = await this.experienceModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Experience entry not found');
    }
    return item;
  }

  async updateAdmin(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    this.validateObjectId(id);

    const existing = await this.experienceModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Experience entry not found');
    }

    const startDate = updateExperienceDto.startDate || existing.startDate;
    const endDate =
      updateExperienceDto.endDate !== undefined
        ? updateExperienceDto.endDate
        : existing.endDate;

    this.validateDates(startDate, endDate);

    const updated = await this.experienceModel
      .findByIdAndUpdate(id, updateExperienceDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Experience entry not found');
    }

    return updated;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.experienceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Experience entry not found');
    }
    return { message: 'Experience entry deleted successfully' };
  }
}
