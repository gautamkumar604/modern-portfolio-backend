import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SiteSetting,
  SiteSettingDocument,
} from './schemas/site-setting.schema';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  private readonly logger = new Logger(SiteSettingsService.name);

  constructor(
    @InjectModel(SiteSetting.name)
    private readonly siteSettingModel: Model<SiteSettingDocument>,
  ) {}

  async getPublicSettings(): Promise<SiteSetting> {
    const settings = await this.siteSettingModel.findOne().exec();
    if (!settings) {
      throw new NotFoundException('Site settings not configured yet');
    }
    return settings;
  }

  async getAdminSettings(): Promise<SiteSetting> {
    const settings = await this.siteSettingModel.findOne().exec();
    if (!settings) {
      throw new NotFoundException('Site settings not configured yet');
    }
    return settings;
  }

  async updateSettings(
    updateDto: UpdateSiteSettingsDto,
  ): Promise<SiteSetting> {
    const updatedSettings = await this.siteSettingModel
      .findOneAndUpdate({}, updateDto, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      })
      .exec();

    return updatedSettings;
  }
}
