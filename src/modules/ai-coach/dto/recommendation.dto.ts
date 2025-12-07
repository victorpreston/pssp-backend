import { ApiProperty } from '@nestjs/swagger';
import {
  RecommendationPriority,
  RecommendationCategory,
  ResourceType,
} from '../enums/recommendation.enums';

/** Learning resource recommendation */
export class ResourceDto {
  @ApiProperty({ example: 'Agile Project Management Course' })
  title: string;

  @ApiProperty({ enum: ResourceType, example: ResourceType.COURSE })
  type: ResourceType;

  @ApiProperty({
    example: 'https://novapioneer.learning/courses/agile-pm',
    required: false,
  })
  url?: string;

  @ApiProperty({
    example: '2 hours',
    required: false,
  })
  duration?: string;

  @ApiProperty({
    example: 'Learn fundamentals of Agile methodologies',
    required: false,
  })
  description?: string;
}

/** Actionable item for learner to complete */
export class ActionItemDto {
  @ApiProperty({ example: 'Complete the Agile fundamentals module' })
  action: string;

  @ApiProperty({
    example: '3 days',
    required: false,
  })
  timeframe?: string;

  @ApiProperty({
    example: 'This will help you understand sprint planning',
    required: false,
  })
  benefit?: string;
}

/** AI-generated recommendation for a specific category */
export class AIRecommendationDto {
  @ApiProperty({
    enum: RecommendationCategory,
    example: RecommendationCategory.CAREER_SKILLS,
  })
  category: RecommendationCategory;

  @ApiProperty({
    enum: RecommendationPriority,
    example: RecommendationPriority.HIGH,
  })
  priority: RecommendationPriority;

  @ApiProperty({
    example: 'Focus on developing project management and collaboration skills',
  })
  recommendation: string;

  @ApiProperty({
    example:
      'Your career skills score (65) indicates room for growth in professional competencies',
    required: false,
  })
  rationale?: string;

  @ApiProperty({ type: [ActionItemDto] })
  action_items: ActionItemDto[];

  @ApiProperty({ type: [ResourceDto], required: false })
  resources?: ResourceDto[];

  @ApiProperty({
    example: '2-3 weeks',
    required: false,
  })
  estimated_impact_time?: string;
}
