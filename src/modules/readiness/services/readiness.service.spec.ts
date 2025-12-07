/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { ReadinessService } from './readiness.service';
import { ScoringEngineService } from './scoring-engine.service';
import { ReadinessSerializerService } from './readiness-serializer.service';
import { CalculateReadinessDto } from '../dto/calculate-readiness.dto';

describe('ReadinessService', () => {
  let service: ReadinessService;
  let scoringEngine: ScoringEngineService;
  let serializer: ReadinessSerializerService;

  const mockScoringResult = {
    baseScore: 75,
    finalScore: 70,
    penalty: 5,
    weakAreas: ['career_skills'],
    hasBlocker: false,
  };

  const mockSerializedResponse = {
    overall_score: 70,
    readiness_level: 'Building' as const,
    category: 'Intermediate',
    breakdown: {
      academics: {
        score: 80,
        weight: 0.35,
        contribution: 28,
        status: 'strong' as const,
        flagged: false,
      },
      career_skills: {
        score: 55,
        weight: 0.4,
        contribution: 22,
        status: 'weak' as const,
        flagged: true,
      },
      life_skills: {
        score: 70,
        weight: 0.25,
        contribution: 17.5,
        status: 'building' as const,
        flagged: false,
      },
    },
    insights: {
      strengths: ['academics'],
      growthAreas: ['career_skills'],
      trend: null,
      estimatedTimeToReady: '4-6 weeks with focused improvement',
    },
    ai_recommendations: [],
    calculated_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadinessService,
        {
          provide: ScoringEngineService,
          useValue: {
            calculate: jest.fn().mockReturnValue(mockScoringResult),
          },
        },
        {
          provide: ReadinessSerializerService,
          useValue: {
            serialize: jest.fn().mockResolvedValue(mockSerializedResponse),
          },
        },
      ],
    }).compile();

    service = module.get<ReadinessService>(ReadinessService);
    scoringEngine = module.get<ScoringEngineService>(ScoringEngineService);
    serializer = module.get<ReadinessSerializerService>(
      ReadinessSerializerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateReadiness', () => {
    it('should orchestrate scoring and serialization', async () => {
      const dto: CalculateReadinessDto = {
        academics: 80,
        career_skills: 55,
        life_skills: 70,
      };

      const result = await service.calculateReadiness(dto);

      // verify scoring engine was called with correct scores
      expect(scoringEngine.calculate).toHaveBeenCalledWith({
        academics: 80,
        career_skills: 55,
        life_skills: 70,
      });

      // verify serializer was called with correct parameters
      expect(serializer.serialize).toHaveBeenCalledWith(
        { academics: 80, career_skills: 55, life_skills: 70 },
        mockScoringResult,
        undefined, // previous_scores
        undefined, // program
        undefined, // goal
      );

      // verify response
      expect(result).toEqual(mockSerializedResponse);
    });

    it('should pass optional context parameters to serializer', async () => {
      const dto: CalculateReadinessDto = {
        academics: 85,
        career_skills: 75,
        life_skills: 80,
        context: {
          program: 'Computer Science',
          goal: 'Software Engineering Internship',
        },
      };

      await service.calculateReadiness(dto);

      expect(serializer.serialize).toHaveBeenCalledWith(
        { academics: 85, career_skills: 75, life_skills: 80 },
        mockScoringResult,
        undefined,
        'Computer Science',
        'Software Engineering Internship',
      );
    });

    it('should pass previous scores to serializer when provided', async () => {
      const previousScores = [
        { date: '2024-01-01', overall: 65 },
        { date: '2024-02-01', overall: 68 },
      ];

      const dto: CalculateReadinessDto = {
        academics: 80,
        career_skills: 70,
        life_skills: 75,
        previous_scores: previousScores,
      };

      await service.calculateReadiness(dto);

      expect(serializer.serialize).toHaveBeenCalledWith(
        { academics: 80, career_skills: 70, life_skills: 75 },
        mockScoringResult,
        previousScores,
        undefined,
        undefined,
      );
    });

    it('should handle all optional fields together', async () => {
      const dto: CalculateReadinessDto = {
        academics: 90,
        career_skills: 85,
        life_skills: 88,
        learner_id: 'L12345',
        previous_scores: [{ date: '2024-01-01', overall: 75 }],
        context: {
          program: 'Data Science',
          goal: 'Machine Learning Engineer',
        },
      };

      const result = await service.calculateReadiness(dto);

      expect(scoringEngine.calculate).toHaveBeenCalled();
      expect(serializer.serialize).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should create correct CategoryScores object from DTO', async () => {
      const dto: CalculateReadinessDto = {
        academics: 95,
        career_skills: 90,
        life_skills: 85,
      };

      await service.calculateReadiness(dto);

      const expectedScores = {
        academics: 95,
        career_skills: 90,
        life_skills: 85,
      };

      expect(scoringEngine.calculate).toHaveBeenCalledWith(expectedScores);
    });
  });
});
