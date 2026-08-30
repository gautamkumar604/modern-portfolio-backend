import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Education, EducationDocument } from './schemas/education.schema';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationQueryDto } from './dto/education-query.dto';

@Injectable()
export class EducationService {
  private readonly logger = new Logger(EducationService.name);

  constructor(
    @InjectModel(Education.name)
    private readonly educationModel: Model<EducationDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid education ID format');
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

  async create(createEducationDto: CreateEducationDto): Promise<Education> {
    this.validateDates(createEducationDto.startDate, createEducationDto.endDate);

    const data = {
      ...createEducationDto,
      isCurrentlyStudying: createEducationDto.isCurrentlyStudying ?? false,
      displayOrder: createEducationDto.displayOrder ?? 0,
      achievements: createEducationDto.achievements ?? [],
    };

    const newEducation = new this.educationModel(data);
    return newEducation.save();
  }

  async findAllPublic() {
    const data = await this.educationModel
      .find()
      .sort({ displayOrder: 1, startDate: -1 })
      .exec();

    return {
      data,
      total: data.length,
    };
  }

  async findAllAdmin(queryDto: EducationQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      const searchRegex = { $regex: queryDto.search.trim(), $options: 'i' };
      filter.$or = [
        { institution: searchRegex },
        { degree: searchRegex },
        { fieldOfStudy: searchRegex },
      ];
    }

    const [data, total] = await Promise.all([
      this.educationModel
        .find(filter)
        .sort({ displayOrder: 1, startDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.educationModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Education> {
    this.validateObjectId(id);
    const item = await this.educationModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Education entry not found');
    }
    return item;
  }

  async updateAdmin(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<Education> {
    this.validateObjectId(id);

    const existing = await this.educationModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Education entry not found');
    }

    const startDate = updateEducationDto.startDate || existing.startDate;
    const endDate =
      updateEducationDto.endDate !== undefined
        ? updateEducationDto.endDate
        : existing.endDate;

    this.validateDates(startDate, endDate);

    const updated = await this.educationModel
      .findByIdAndUpdate(id, updateEducationDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Education entry not found');
    }

    return updated;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.educationModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Education entry not found');
    }
    return { message: 'Education entry deleted successfully' };
  }
}
