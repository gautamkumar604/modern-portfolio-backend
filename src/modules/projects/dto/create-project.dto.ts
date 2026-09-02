import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsUrl,
  IsEnum,
  IsDateString,
  MaxLength,
  Min,
  Matches,
  ArrayMinSize,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must contain only lowercase alphanumeric characters separated by single hyphens',
  })
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Short description is required' })
  @MaxLength(300, { message: 'Short description cannot exceed 300 characters' })
  shortDescription: string;

  @IsOptional()
  @IsString()
  detailedDescription?: string;

  @IsOptional()
  @IsString({ message: 'Cover image must be a string' })
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each gallery image must be a string' })
  galleryImages?: string[];

  @IsArray({ message: 'Technologies must be an array' })
  @ArrayMinSize(1, { message: 'At least one technology is required' })
  @IsString({ each: true, message: 'Each technology must be a string' })
  technologies: string[];

  @IsOptional()
  @IsString({ message: 'GitHub URL must be a string' })
  githubUrl?: string;

  @IsOptional()
  @IsString({ message: 'Live demo URL must be a string' })
  liveDemoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsEnum(['web', 'mobile', 'fullstack', 'cli', 'open-source', 'other'])
  projectType?: string;

  @IsOptional()
  @IsEnum(['completed', 'in-progress', 'maintained', 'archived'])
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyFeatures?: string[];

  @IsOptional()
  @IsString()
  challenges?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  outcome?: string;
}
