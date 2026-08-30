import { IsOptional, IsEnum } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsEnum(['unread', 'read', 'archived', 'replied'], {
    message: 'Status must be one of: unread, read, archived, replied',
  })
  status?: string;
}
