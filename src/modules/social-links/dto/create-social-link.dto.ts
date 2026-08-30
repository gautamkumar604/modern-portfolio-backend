import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  @IsNotEmpty({ message: 'Platform is required' })
  @MaxLength(50, { message: 'Platform name cannot exceed 50 characters' })
  platform: string;

  @IsString()
  @IsNotEmpty({ message: 'URL is required' })
  @IsUrl({}, { message: 'URL must be a valid web address' })
  url: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
