import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EducationDocument = Education & Document;

@Schema({ timestamps: true, collection: 'education' })
export class Education {
  @Prop({ required: true, trim: true, maxlength: 150 })
  institution: string;

  @Prop({ required: true, trim: true, maxlength: 150 })
  degree: string;

  @Prop({ trim: true, maxlength: 150 })
  fieldOfStudy?: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ default: false })
  isCurrentlyStudying: boolean;

  @Prop({ trim: true, maxlength: 100 })
  location?: string;

  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ trim: true, maxlength: 50 })
  grade?: string;

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ default: 0 })
  displayOrder: number;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
EducationSchema.index({ displayOrder: 1, startDate: -1 });
