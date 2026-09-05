import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsEnum,
  MaxLength,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty({ message: 'Company is required' })
  @MaxLength(150, { message: 'Company name cannot exceed 150 characters' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  @MaxLength(150, { message: 'Position title cannot exceed 150 characters' })
  position: string;

  @IsOptional()
  @IsEnum(['full-time', 'part-time', 'contract', 'freelance', 'internship'], {
    message:
      'Employment type must be one of: full-time, part-time, contract, freelance, internship',
  })
  employmentType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Location cannot exceed 100 characters' })
  location?: string;

  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrentlyWorking?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each responsibility must be a string' })
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each technology must be a string' })
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each achievement must be a string' })
  achievements?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
