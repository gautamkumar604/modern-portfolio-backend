import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, collection: 'services' })
export class Service {
  @Prop({ required: true, trim: true, maxlength: 100 })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 250 })
  shortDescription: string;

  @Prop({ trim: true })
  detailedDescription?: string;

  @Prop({ trim: true })
  icon?: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ isActive: 1, displayOrder: 1 });
