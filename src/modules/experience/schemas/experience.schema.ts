import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExperienceDocument = Experience & Document;

@Schema({ timestamps: true, collection: 'experience' })
export class Experience {
  @Prop({ required: true, trim: true, maxlength: 150 })
  company: string;

  @Prop({ required: true, trim: true, maxlength: 150 })
  position: string;

  @Prop({
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time',
  })
  employmentType: string;

  @Prop({ trim: true, maxlength: 100 })
  location?: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ default: false })
  isCurrentlyWorking: boolean;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  responsibilities: string[];

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ default: 0 })
  displayOrder: number;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
ExperienceSchema.index({ displayOrder: 1, startDate: -1 });
