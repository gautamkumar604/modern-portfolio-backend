import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  subject: string;

  @Prop({ required: true, trim: true, maxlength: 3000 })
  message: string;

  @Prop({
    enum: ['unread', 'read', 'archived', 'replied'],
    default: 'unread',
  })
  status: string;

  @Prop({ trim: true })
  ipAddress?: string;

  @Prop({ trim: true })
  userAgent?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ status: 1, createdAt: -1 });
