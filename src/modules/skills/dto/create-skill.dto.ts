import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Skill name is required' })
  @MaxLength(100, { message: 'Skill name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Proficiency must be an integer between 0 and 100' })
  @Min(0, { message: 'Proficiency cannot be less than 0' })
  @Max(100, { message: 'Proficiency cannot exceed 100' })
  proficiency?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
