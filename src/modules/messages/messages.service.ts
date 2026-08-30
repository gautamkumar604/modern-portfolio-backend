import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid message ID format');
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async createPublic(
    dto: CreateMessageDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const newMessage = new this.messageModel({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      subject: dto.subject.trim(),
      message: dto.message.trim(),
      status: 'unread',
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    });

    await newMessage.save();
    return { message: 'Your message has been sent successfully' };
  }

  async findAllAdmin(queryDto: MessageQueryDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (queryDto.search && queryDto.search.trim().length > 0) {
      const searchRegex = { $regex: this.escapeRegex(queryDto.search.trim()), $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    const [data, total] = await Promise.all([
      this.messageModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findByIdAdmin(id: string): Promise<Message> {
    this.validateObjectId(id);
    const item = await this.messageModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Message not found');
    }
    return item;
  }

  async updateAdmin(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    this.validateObjectId(id);

    const updated = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Message not found');
    }

    return updated;
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const deleted = await this.messageModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Message not found');
    }
    return { message: 'Message deleted successfully' };
  }
}
