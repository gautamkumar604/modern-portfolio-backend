import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true, trim: true, maxlength: 150 })
  title: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop({ required: true, trim: true, maxlength: 300 })
  shortDescription: string;

  @Prop({ trim: true })
  detailedDescription?: string;

  @Prop({ trim: true })
  coverImage?: string;

  @Prop({ type: [String], default: [] })
  galleryImages?: string[];

  @Prop({ required: true, type: [String] })
  technologies: string[];

  @Prop({ trim: true })
  githubUrl?: string;

  @Prop({ trim: true })
  liveDemoUrl?: string;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  completionDate?: Date;

  @Prop({
    enum: ['web', 'mobile', 'fullstack', 'cli', 'open-source', 'other'],
    default: 'fullstack',
  })
  projectType: string;

  @Prop({
    enum: ['completed', 'in-progress', 'maintained', 'archived'],
    default: 'completed',
  })
  status: string;

  @Prop({ type: [String], default: [] })
  keyFeatures?: string[];

  @Prop({ trim: true })
  challenges?: string;

  @Prop({ trim: true })
  solution?: string;

  @Prop({ trim: true })
  outcome?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ isPublished: 1, isFeatured: 1, displayOrder: 1 });
