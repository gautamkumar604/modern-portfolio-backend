import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillQueryDto } from './dto/skill-query.dto';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<SkillDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid skill ID format');
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async checkNameUniqueness(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const trimmedName = name.trim();
    const query: any = {
      name: { $regex: `^${this.escapeRegex(trimmedName)}$`, $options: 'i' },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await this.skillModel.findOne(query).exec();
    if (existing) {
      throw new ConflictException('Skill with this name already exists');
    }
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    await this.checkNameUniqueness(createSkillDto.name);

    const skillData = {
      ...createSkillDto,
      name: createSkillDto.name.trim(),
      category: createSkillDto.category.trim(),
      displayOrder: createSkillDto.displayOrder ?? 0,
      isFeatured: createSkillDto.isFeatured ?? false,
      isVisible: createSkillDto.isVisible ?? true,
    };

    const newSkill = new this.skillModel(skillData);
    return newSkill.save();
  }

  async findAllPublic(queryDto: SkillQueryDto) {
    const filter: any = { isVisible: true };

    if (queryDto.category) {
      filter.category = {
        $regex: `^${this.escapeRegex(queryDto.category.trim())}$`,
        $options: 'i',
      };
    }

    if (queryDto.isFeatured !== undefined) {
      filter.isFeatured = queryDto.isFeatured;
    }

    const data = await this.skillModel
      .find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .exec();

    return {
      data,
      total: data.length,
    };
  }

  async findAllAdmin(queryDto: SkillQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      filter.name = {
        $regex: this.escapeRegex(queryDto.search.trim()),
        $options: 'i',
      };
    }

    if (queryDto.category && queryDto.category.trim().length > 0) {
      filter.category = {
        $regex: `^${this.escapeRegex(queryDto.category.trim())}$`,
        $options: 'i',
      };
    }

    if (queryDto.isVisible !== undefined) {
      filter.isVisible = queryDto.isVisible;
    }

    if (queryDto.isFeatured !== undefined) {
      filter.isFeatured = queryDto.isFeatured;
    }

    const [data, total] = await Promise.all([
      this.skillModel
        .find(filter)
        .sort({ displayOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.skillModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Skill> {
    this.validateObjectId(id);
    const skill = await this.skillModel.findById(id).exec();
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async updateAdmin(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill> {
    this.validateObjectId(id);

    const existingSkill = await this.skillModel.findById(id).exec();
    if (!existingSkill) {
      throw new NotFoundException('Skill not found');
    }

    if (updateSkillDto.name && updateSkillDto.name.trim() !== existingSkill.name) {
      await this.checkNameUniqueness(updateSkillDto.name, id);
    }

    const updateData: any = { ...updateSkillDto };
    if (updateSkillDto.name) {
      updateData.name = updateSkillDto.name.trim();
    }
    if (updateSkillDto.category) {
      updateData.category = updateSkillDto.category.trim();
    }

    const updatedSkill = await this.skillModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updatedSkill) {
      throw new NotFoundException('Skill not found');
    }

    return updatedSkill;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.skillModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Skill not found');
    }
    return { message: 'Skill deleted successfully' };
  }
}
