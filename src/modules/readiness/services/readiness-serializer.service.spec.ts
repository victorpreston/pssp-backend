/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ReadinessSerializerService } from './readiness-serializer.service';
import { AiCoachService } from '../../ai-coach/services/ai-coach.service';
import {
  CategoryScores,
  ScoringResult,
} from '../../../shared/types/scoring.types';
import { ReadinessLevel } from '../../../shared/types/readiness.types';
import {
  RecommendationCategory,
  RecommendationPriority,
} from '../../ai-coach/enums/recommendation.enums';

describe('ReadinessSerializerService', () => {
  let service: ReadinessSerializerService;
  let aiCoachService: AiCoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadinessSerializerService,
        {
          provide: AiCoachService,
          useValue: {
            generateRecommendations: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<ReadinessSerializerService>(
      ReadinessSerializerService,
    );
    aiCoachService = module.get<AiCoachService>(AiCoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('serialize', () => {
    const scores: CategoryScores = {
      academics: 80,
      career_skills: 70,
      life_skills: 75,
    };

    const scoringResult: ScoringResult = {
      baseScore: 75,
      finalScore: 75,
      penalty: 0,
      weakAreas: [],
      hasBlocker: false,
    };

    it('should serialize scoring result correctly', async () => {
      const result = await service.serialize(scores, scoringResult);

      expect(result.overall_score).toBe(75);
      expect(result.readiness_level).toBe(ReadinessLevel.READY);
      expect(result.category).toBe('Advanced');
      expect(result.breakdown).toBeDefined();
      expect(result.insights).toBeDefined();
      expect(result.calculated_at).toBeDefined();
    });

    it('should calculate breakdown with correct weights and contributions', async () => {
      const result = await service.serialize(scores, scoringResult);

      // Academics: 35% weight
      expect(result.breakdown.academics.score).toBe(80);
      expect(result.breakdown.academics.weight).toBe(0.35);
      expect(result.breakdown.academics.contribution).toBe(28);
      expect(result.breakdown.academics.status).toBe('strong');
      expect(result.breakdown.academics.flagged).toBe(false);

      // Career Skills: 40% weight
      expect(result.breakdown.career_skills.score).toBe(70);
      expect(result.breakdown.career_skills.weight).toBe(0.4);
      expect(result.breakdown.career_skills.contribution).toBe(28);
      expect(result.breakdown.career_skills.status).toBe('building');
      expect(result.breakdown.career_skills.flagged).toBe(false);

      // Life Skills: 25% weight
      expect(result.breakdown.life_skills.score).toBe(75);
      expect(result.breakdown.life_skills.weight).toBe(0.25);
      expect(result.breakdown.life_skills.contribution).toBe(18.75);
      expect(result.breakdown.life_skills.status).toBe('strong');
      expect(result.breakdown.life_skills.flagged).toBe(false);
    });

    it('should flag weak categories correctly', async () => {
      const weakScores: CategoryScores = {
        academics: 80,
        career_skills: 55,
        life_skills: 45,
      };

      const weakResult: ScoringResult = {
        baseScore: 65,
        finalScore: 55,
        penalty: 10,
        weakAreas: ['career_skills', 'life_skills'],
        hasBlocker: false,
      };

      const result = await service.serialize(weakScores, weakResult);

      expect(result.breakdown.academics.flagged).toBe(false);
      expect(result.breakdown.career_skills.flagged).toBe(true);
      expect(result.breakdown.life_skills.flagged).toBe(true);
    });

    it('should identify strengths correctly', async () => {
      const strongScores: CategoryScores = {
        academics: 90,
        career_skills: 60,
        life_skills: 65,
      };

      const result = await service.serialize(strongScores, scoringResult);

      expect(result.insights.strengths).toContain('academics');
      expect(result.insights.strengths).not.toContain('career_skills');
      expect(result.insights.strengths).not.toContain('life_skills');
    });

    it('should identify growth areas correctly', async () => {
      const mixedScores: CategoryScores = {
        academics: 90,
        career_skills: 55,
        life_skills: 50,
      };

      const mixedResult: ScoringResult = {
        baseScore: 70,
        finalScore: 60,
        penalty: 10,
        weakAreas: ['career_skills', 'life_skills'],
        hasBlocker: false,
      };

      const result = await service.serialize(mixedScores, mixedResult);

      expect(result.insights.growthAreas).toContain('career_skills');
      expect(result.insights.growthAreas).toContain('life_skills');
      expect(result.insights.growthAreas).not.toContain('academics');
    });

    it('should determine correct readiness level for READY', async () => {
      const readyScores: CategoryScores = {
        academics: 85,
        career_skills: 80,
        life_skills: 78,
      };

      const readyResult: ScoringResult = {
        baseScore: 82,
        finalScore: 82,
        penalty: 0,
        weakAreas: [],
        hasBlocker: false,
      };

      const result = await service.serialize(readyScores, readyResult);

      expect(result.readiness_level).toBe(ReadinessLevel.READY);
      expect(result.category).toBe('Advanced');
    });

    it('should determine correct readiness level for BUILDING', async () => {
      const buildingScores: CategoryScores = {
        academics: 70,
        career_skills: 65,
        life_skills: 68,
      };

      const buildingResult: ScoringResult = {
        baseScore: 68,
        finalScore: 68,
        penalty: 0,
        weakAreas: [],
        hasBlocker: false,
      };

      const result = await service.serialize(buildingScores, buildingResult);

      expect(result.readiness_level).toBe(ReadinessLevel.BUILDING);
      expect(result.category).toBe('Intermediate');
    });

    it('should determine NOT_READY when blocker exists', async () => {
      const blockerScores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      const blockerResult: ScoringResult = {
        baseScore: 65,
        finalScore: 60,
        penalty: 5,
        weakAreas: ['life_skills'],
        hasBlocker: true,
      };

      const result = await service.serialize(blockerScores, blockerResult);

      expect(result.readiness_level).toBe(ReadinessLevel.NOT_READY);
      expect(result.category).toBe('Pre-Foundation');
    });

    it('should call AI Coach service with correct parameters', async () => {
      const program = 'Computer Science';
      const goal = 'Software Engineer';

      await service.serialize(scores, scoringResult, undefined, program, goal);

      expect(aiCoachService.generateRecommendations).toHaveBeenCalledWith({
        scores,
        overall_score: 75,
        readiness_level: ReadinessLevel.READY,
        strengths: expect.any(Array),
        growthAreas: expect.any(Array),
        program,
        goal,
      });
    });

    it('should include AI recommendations in response', async () => {
      const mockRecommendations = [
        {
          category: RecommendationCategory.CAREER_SKILLS,
          priority: RecommendationPriority.HIGH,
          recommendation: 'Build a portfolio',
          rationale: 'Demonstrate skills',
          action_items: [],
          resources: [],
          estimated_impact_time: '2-3 months',
        },
      ];

      jest
        .spyOn(aiCoachService, 'generateRecommendations')
        .mockResolvedValue(mockRecommendations);

      const result = await service.serialize(scores, scoringResult);

      expect(result.ai_recommendations).toEqual(mockRecommendations);
    });

    it('should calculate trend when previous scores provided', async () => {
      const previousScores = [
        { date: '2024-01-01', overall: 65 },
        { date: '2024-02-01', overall: 70 },
      ];

      const result = await service.serialize(
        scores,
        scoringResult,
        previousScores,
      );

      expect(result.insights.trend).toContain('improving');
      expect(result.insights.trend).toContain('+5 points');
    });

    it('should handle declining trend', async () => {
      const previousScores = [{ date: '2024-01-01', overall: 80 }];

      const decliningResult: ScoringResult = {
        baseScore: 70,
        finalScore: 70,
        penalty: 0,
        weakAreas: [],
        hasBlocker: false,
      };

      const result = await service.serialize(
        scores,
        decliningResult,
        previousScores,
      );

      expect(result.insights.trend).toContain('declining');
      expect(result.insights.trend).toContain('-10 points');
    });

    it('should handle stable trend', async () => {
      const previousScores = [{ date: '2024-01-01', overall: 75 }];

      const result = await service.serialize(
        scores,
        scoringResult,
        previousScores,
      );

      expect(result.insights.trend).toContain('stable');
    });

    it('should set undefined trend when no previous scores', async () => {
      const result = await service.serialize(scores, scoringResult);

      expect(result.insights.trend).toBeUndefined();
    });
  });
});
