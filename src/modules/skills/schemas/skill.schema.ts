import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true, collection: 'skills' })
export class Skill {
  @Prop({ required: true, trim: true, unique: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ min: 0, max: 100 })
  proficiency?: number;

  @Prop({ trim: true })
  icon?: string;

  @Prop({ trim: true, maxlength: 250 })
  description?: string;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isVisible: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
SkillSchema.index({ category: 1, displayOrder: 1 });
SkillSchema.index({ isVisible: 1, isFeatured: 1 });
