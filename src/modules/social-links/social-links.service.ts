import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SocialLink, SocialLinkDocument } from './schemas/social-link.schema';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { SocialLinkQueryDto } from './dto/social-link-query.dto';

@Injectable()
export class SocialLinksService {
  private readonly logger = new Logger(SocialLinksService.name);

  constructor(
    @InjectModel(SocialLink.name)
    private readonly socialLinkModel: Model<SocialLinkDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid social link ID format');
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async checkPlatformUniqueness(
    platform: string,
    excludeId?: string,
  ): Promise<void> {
    const trimmedPlatform = platform.trim();
    const query: any = {
      platform: { $regex: `^${this.escapeRegex(trimmedPlatform)}$`, $options: 'i' },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await this.socialLinkModel.findOne(query).exec();
    if (existing) {
      throw new ConflictException(
        'Social link for this platform already exists',
      );
    }
  }

  async create(
    createSocialLinkDto: CreateSocialLinkDto,
  ): Promise<SocialLink> {
    await this.checkPlatformUniqueness(createSocialLinkDto.platform);

    const data = {
      ...createSocialLinkDto,
      platform: createSocialLinkDto.platform.trim(),
      url: createSocialLinkDto.url.trim(),
      displayOrder: createSocialLinkDto.displayOrder ?? 0,
      isActive: createSocialLinkDto.isActive ?? true,
    };

    const newSocialLink = new this.socialLinkModel(data);
    return newSocialLink.save();
  }

  async findAllPublic() {
    const data = await this.socialLinkModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, platform: 1 })
      .exec();

    return {
      data,
      total: data.length,
    };
  }

  async findAllAdmin(queryDto: SocialLinkQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      filter.platform = {
        $regex: this.escapeRegex(queryDto.search.trim()),
        $options: 'i',
      };
    }

    if (queryDto.isActive !== undefined) {
      filter.isActive = queryDto.isActive;
    }

    const [data, total] = await Promise.all([
      this.socialLinkModel
        .find(filter)
        .sort({ displayOrder: 1, platform: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.socialLinkModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<SocialLink> {
    this.validateObjectId(id);
    const item = await this.socialLinkModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Social link not found');
    }
    return item;
  }

  async updateAdmin(
    id: string,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ): Promise<SocialLink> {
    this.validateObjectId(id);

    const existing = await this.socialLinkModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Social link not found');
    }

    if (
      updateSocialLinkDto.platform &&
      updateSocialLinkDto.platform.trim() !== existing.platform
    ) {
      await this.checkPlatformUniqueness(updateSocialLinkDto.platform, id);
    }

    const updateData: any = { ...updateSocialLinkDto };
    if (updateSocialLinkDto.platform) {
      updateData.platform = updateSocialLinkDto.platform.trim();
    }
    if (updateSocialLinkDto.url) {
      updateData.url = updateSocialLinkDto.url.trim();
    }

    const updated = await this.socialLinkModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Social link not found');
    }

    return updated;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.socialLinkModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Social link not found');
    }
    return { message: 'Social link deleted successfully' };
  }
}
