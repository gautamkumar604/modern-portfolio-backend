import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.profileModel.findOne().exec();
    if (!profile) {
      throw new NotFoundException(
        'Profile not configured yet. Run npm run seed:profile first.',
      );
    }
    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const updatedProfile = await this.profileModel
      .findOneAndUpdate({}, updateProfileDto, {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      })
      .exec();

    return updatedProfile;
  }
}
