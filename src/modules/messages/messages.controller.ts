import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPublic(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: any,
  ) {
    const ipAddress =
      (req.headers?.['x-forwarded-for'] as string) || req.ip;
    const userAgent = req.headers?.['user-agent'];

    return this.messagesService.createPublic(
      createMessageDto,
      ipAddress,
      userAgent,
    );
  }
}
