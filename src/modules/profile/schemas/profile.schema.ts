import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true, collection: 'profile' })
export class Profile {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 150 })
  title: string;

  @Prop({ trim: true, maxlength: 100 })
  heroGreeting?: string;

  @Prop({ trim: true, maxlength: 200 })
  heroHeadline?: string;

  @Prop({ trim: true, maxlength: 300 })
  heroSubtitle?: string;

  @Prop({ trim: true, maxlength: 50 })
  primaryCtaText?: string;

  @Prop({ trim: true })
  primaryCtaUrl?: string;

  @Prop({ trim: true, maxlength: 50 })
  secondaryCtaText?: string;

  @Prop({ trim: true })
  secondaryCtaUrl?: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  shortBio: string;

  @Prop({ trim: true })
  detailedBio?: string;

  @Prop({ trim: true })
  avatarUrl?: string;

  @Prop({ trim: true, maxlength: 100 })
  location?: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  resumeUrl?: string;

  @Prop({
    enum: ['available', 'busy', 'open_to_offers', 'unavailable'],
    default: 'available',
  })
  availabilityStatus: string;

  @Prop({ min: 0, max: 70 })
  yearsOfExperience?: number;

  @Prop({ type: [String], default: [] })
  highlights: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
