import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: ['admin', 'superadmin'], default: 'admin' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
