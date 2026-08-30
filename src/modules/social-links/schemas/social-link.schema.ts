import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialLinkDocument = SocialLink & Document;

@Schema({ timestamps: true, collection: 'social_links' })
export class SocialLink {
  @Prop({ required: true, trim: true })
  platform: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ trim: true })
  icon?: string;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);
SocialLinkSchema.index({ isActive: 1, displayOrder: 1 });
