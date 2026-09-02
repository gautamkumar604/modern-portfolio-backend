import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsBoolean,
  MaxLength,
  IsArray,
} from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Site name cannot exceed 100 characters' })
  siteName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Tagline cannot exceed 200 characters' })
  tagline?: string;

  @IsOptional()
  @IsString({ message: 'Favicon URL must be a string' })
  faviconUrl?: string;

  @IsOptional()
  @IsString({ message: 'Logo URL must be a string' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Default SEO title cannot exceed 200 characters' })
  defaultSeoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Default SEO description cannot exceed 300 characters' })
  defaultSeoDescription?: string;

  @IsOptional()
  @IsArray({ message: 'Keywords must be an array of strings' })
  @IsString({ each: true, message: 'Each keyword must be a string' })
  keywords?: string[];

  @IsOptional()
  @IsString({ message: 'OG Image URL must be a string' })
  ogImageUrl?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be a valid email address' })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsString()
  copyrightText?: string;

  @IsOptional()
  @IsBoolean({ message: 'isMaintenanceMode must be a boolean' })
  isMaintenanceMode?: boolean;

  @IsOptional()
  @IsString()
  analyticsId?: string;
}
