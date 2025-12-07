import { ReadinessResponseDto } from './readiness-response.dto';
import {
  ReadinessLevel,
  CategoryStatus,
} from '../../../shared/types/readiness.types';
import {
  RecommendationPriority,
  RecommendationCategory,
  ResourceType,
} from '../../ai-coach/enums/recommendation.enums';

describe('ReadinessResponseDto', () => {
  it('should create a complete response DTO', () => {
    const dto = new ReadinessResponseDto();
    dto.overall_score = 70;
    dto.readiness_level = ReadinessLevel.BUILDING;
    dto.category = 'Intermediate';
    dto.breakdown = {
      academics: {
        score: 80,
        weight: 0.35,
        contribution: 28,
        status: CategoryStatus.STRONG,
        flagged: false,
      },
      career_skills: {
        score: 60,
        weight: 0.4,
        contribution: 24,
        status: CategoryStatus.WEAK,
        flagged: true,
      },
      life_skills: {
        score: 70,
        weight: 0.25,
        contribution: 17.5,
        status: CategoryStatus.BUILDING,
        flagged: false,
      },
    };
    dto.insights = {
      strengths: ['academics', 'life_skills'],
      growthAreas: ['career_skills'],
      trend: 'improving (+6 points from last assessment)',
      estimatedTimeToReady: '4-6 weeks with consistent engagement',
    };
    dto.ai_recommendations = [
      {
        category: RecommendationCategory.CAREER_SKILLS,
        priority: RecommendationPriority.HIGH,
        recommendation: 'Focus on interview preparation workshops',
        rationale: 'Interview prep is your lowest sub-skill at 50',
        resources: [
          {
            title: 'Interview Prep Module',
            type: ResourceType.COURSE,
          },
          {
            title: 'Mock Interview Sessions',
            type: ResourceType.WORKSHOP,
          },
        ],
        action_items: [
          {
            action: 'Complete 3 mock interviews this week',
          },
        ],
      },
    ];
    dto.calculated_at = '2025-12-07T00:00:00.000Z';

    expect(dto).toBeInstanceOf(ReadinessResponseDto);
    expect(dto.overall_score).toBe(70);
    expect(dto.readiness_level).toBe(ReadinessLevel.BUILDING);
    expect(dto.breakdown.academics.status).toBe(CategoryStatus.STRONG);
  });

  it('should create response DTO without optional fields', () => {
    const dto = new ReadinessResponseDto();
    dto.overall_score = 85;
    dto.readiness_level = ReadinessLevel.READY;
    dto.category = 'Advanced';
    dto.breakdown = {
      academics: {
        score: 90,
        weight: 0.35,
        contribution: 31.5,
        status: CategoryStatus.STRONG,
      },
      career_skills: {
        score: 85,
        weight: 0.4,
        contribution: 34,
        status: CategoryStatus.STRONG,
      },
      life_skills: {
        score: 80,
        weight: 0.25,
        contribution: 20,
        status: CategoryStatus.STRONG,
      },
    };
    dto.insights = {
      strengths: ['academics', 'career_skills', 'life_skills'],
      growthAreas: [],
    };
    dto.calculated_at = '2025-12-07T00:00:00.000Z';

    expect(dto).toBeInstanceOf(ReadinessResponseDto);
    expect(dto.ai_recommendations).toBeUndefined();
    expect(dto.insights.trend).toBeUndefined();
  });
});
