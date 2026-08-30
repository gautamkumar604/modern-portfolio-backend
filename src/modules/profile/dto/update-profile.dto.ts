import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsEnum,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsArray,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Hero greeting cannot exceed 100 characters' })
  heroGreeting?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Hero headline cannot exceed 200 characters' })
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Hero subtitle cannot exceed 300 characters' })
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Primary CTA text cannot exceed 50 characters' })
  primaryCtaText?: string;

  @IsOptional()
  @IsString()
  primaryCtaUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Secondary CTA text cannot exceed 50 characters' })
  secondaryCtaText?: string;

  @IsOptional()
  @IsString()
  secondaryCtaUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Short bio cannot exceed 500 characters' })
  shortBio?: string;

  @IsOptional()
  @IsString()
  detailedBio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Location cannot exceed 100 characters' })
  location?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Resume URL must be a valid URL' })
  resumeUrl?: string;

  @IsOptional()
  @IsEnum(['available', 'busy', 'open_to_offers', 'unavailable'], {
    message:
      'Availability status must be one of: available, busy, open_to_offers, unavailable',
  })
  availabilityStatus?: string;

  @IsOptional()
  @IsInt({ message: 'Years of experience must be an integer' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  @Max(70, { message: 'Years of experience cannot exceed 70' })
  yearsOfExperience?: number;

  @IsOptional()
  @IsArray({ message: 'Highlights must be an array of strings' })
  @IsString({ each: true, message: 'Each highlight must be a string' })
  highlights?: string[];
}
