/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import {
  ReadinessLevel,
  CategoryStatus,
  ScoreBreakdown,
} from '../../../shared/types/readiness.types';
import { AIRecommendationDto } from '../../ai-coach/dto/recommendation.dto';

class CategoryBreakdown {
  @ApiProperty({ example: 80 })
  score: number;

  @ApiProperty({ example: 0.35 })
  weight: number;

  @ApiProperty({ example: 28 })
  contribution: number;

  @ApiProperty({ example: 'strong', enum: CategoryStatus })
  status: CategoryStatus;

  @ApiProperty({ example: false })
  flagged?: boolean;
}

class Insights {
  @ApiProperty({ example: ['academics', 'life_skills'] })
  strengths: string[];

  @ApiProperty({ example: ['career_skills'] })
  growthAreas: string[];

  @ApiProperty({ example: 'improving (+6 points from last assessment)' })
  trend?: string;

  @ApiProperty({ example: '4-6 weeks with consistent engagement' })
  estimatedTimeToReady?: string;
}

/** Response DTO for readiness calculation results */
export class ReadinessResponseDto {
  @ApiProperty({ example: 70, description: 'Overall readiness score (0-100)' })
  overall_score: number;

  @ApiProperty({
    example: 'Building',
    enum: ReadinessLevel,
    description: 'Readiness level category',
  })
  readiness_level: ReadinessLevel;

  @ApiProperty({ example: 'Intermediate' })
  category: string;

  @ApiProperty({ type: () => CategoryBreakdownResponse })
  breakdown: {
    academics: CategoryBreakdown;
    career_skills: CategoryBreakdown;
    life_skills: CategoryBreakdown;
  };

  @ApiProperty({ type: Insights })
  insights: Insights;

  @ApiProperty({ type: [AIRecommendationDto], required: false })
  ai_recommendations?: AIRecommendationDto[];

  @ApiProperty({ example: '2025-12-07T00:00:00.000Z' })
  calculated_at: string;
}

class CategoryBreakdownResponse {
  @ApiProperty({ type: CategoryBreakdown })
  academics: CategoryBreakdown;

  @ApiProperty({ type: CategoryBreakdown })
  career_skills: CategoryBreakdown;

  @ApiProperty({ type: CategoryBreakdown })
  life_skills: CategoryBreakdown;
}
