import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SubCategoryScores {
  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  stem_proficiency?: number;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  literacy?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  critical_thinking?: number;
}

class CareerSubCategoryScores {
  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  resume_building?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  interview_prep?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  networking?: number;
}

class LifeSubCategoryScores {
  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  time_management?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  communication?: number;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  financial_literacy?: number;
}

class DetailedScores {
  @ApiPropertyOptional({ type: SubCategoryScores })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SubCategoryScores)
  academics?: SubCategoryScores;

  @ApiPropertyOptional({ type: CareerSubCategoryScores })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CareerSubCategoryScores)
  career_skills?: CareerSubCategoryScores;

  @ApiPropertyOptional({ type: LifeSubCategoryScores })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LifeSubCategoryScores)
  life_skills?: LifeSubCategoryScores;
}

class LearnerContext {
  @ApiPropertyOptional({ example: 'L12345' })
  @IsOptional()
  @IsString()
  learner_id?: string;

  @ApiPropertyOptional({ example: 'TGP', enum: ['PSP', 'TGP', 'IP'] })
  @IsOptional()
  @IsString()
  program?: string;

  @ApiPropertyOptional({ example: 'software_engineering' })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  modules_completed?: number;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  engagement_score?: number;
}

class PreviousScore {
  @ApiProperty({ example: '2024-11-01' })
  @IsString()
  date: string;

  @ApiProperty({ example: 62 })
  @IsNumber()
  @Min(0)
  @Max(100)
  overall: number;
}

/** Input DTO for calculating learner readiness score */
export class CalculateReadinessDto {
  @ApiPropertyOptional({
    example: 'L001',
    description: 'Unique learner identifier',
  })
  @IsOptional()
  @IsString()
  learner_id?: string;

  @ApiProperty({
    example: 80,
    description: 'Academic performance score (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  academics: number;

  @ApiProperty({
    example: 60,
    description: 'Career skills development score (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  career_skills: number;

  @ApiProperty({ example: 70, description: 'Life skills score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  life_skills: number;

  @ApiPropertyOptional({ type: DetailedScores })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DetailedScores)
  details?: DetailedScores;

  @ApiPropertyOptional({ type: LearnerContext })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LearnerContext)
  context?: LearnerContext;

  @ApiPropertyOptional({ type: [PreviousScore] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreviousScore)
  previous_scores?: PreviousScore[];
}
