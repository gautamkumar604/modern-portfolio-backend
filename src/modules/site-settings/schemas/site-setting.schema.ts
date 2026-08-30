import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingDocument = SiteSetting & Document;

@Schema({ timestamps: true, collection: 'site_settings' })
export class SiteSetting {
  @Prop({ required: true, default: 'Portfolio CMS' })
  siteName: string;

  @Prop({ trim: true, maxlength: 200 })
  tagline?: string;

  @Prop({ trim: true })
  faviconUrl?: string;

  @Prop({ trim: true })
  logoUrl?: string;

  @Prop({ required: true, default: 'Portfolio' })
  defaultSeoTitle: string;

  @Prop({ required: true, maxlength: 300 })
  defaultSeoDescription: string;

  @Prop({ type: [String], default: [] })
  keywords?: string[];

  @Prop({ trim: true })
  ogImageUrl?: string;

  @Prop({ trim: true })
  contactEmail?: string;

  @Prop({ trim: true })
  footerText?: string;

  @Prop({ trim: true })
  copyrightText?: string;

  @Prop({ default: false })
  isMaintenanceMode: boolean;

  @Prop({ trim: true })
  analyticsId?: string;
}

export const SiteSettingSchema = SchemaFactory.createForClass(SiteSetting);
