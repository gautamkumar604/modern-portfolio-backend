import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
  IsArray,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty({ message: 'Institution is required' })
  @MaxLength(150, { message: 'Institution cannot exceed 150 characters' })
  institution: string;

  @IsString()
  @IsNotEmpty({ message: 'Degree is required' })
  @MaxLength(150, { message: 'Degree cannot exceed 150 characters' })
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Field of study cannot exceed 150 characters' })
  fieldOfStudy?: string;

  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrentlyStudying?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Location cannot exceed 100 characters' })
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Grade cannot exceed 50 characters' })
  grade?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each achievement must be a string' })
  achievements?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
