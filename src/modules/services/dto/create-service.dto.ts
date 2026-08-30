import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
  IsArray,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Service title is required' })
  @MaxLength(100, { message: 'Service title cannot exceed 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Short description is required' })
  @MaxLength(250, { message: 'Short description cannot exceed 250 characters' })
  shortDescription: string;

  @IsOptional()
  @IsString()
  detailedDescription?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each feature must be a string' })
  features?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
