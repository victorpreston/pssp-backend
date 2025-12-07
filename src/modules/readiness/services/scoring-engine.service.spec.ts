import { Test, TestingModule } from '@nestjs/testing';
import { ScoringEngineService } from './scoring-engine.service';
import { CategoryScores } from '../../../shared/types/scoring.types';

describe('ScoringEngineService', () => {
  let service: ScoringEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringEngineService],
    }).compile();

    service = module.get<ScoringEngineService>(ScoringEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculate', () => {
    it('should calculate score with no weak areas', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 75,
        life_skills: 70,
      };

      const result = service.calculate(scores);

      // Base: 80*0.35 + 75*0.4 + 70*0.25 = 28 + 30 + 17.5 = 75.5 -> 76
      expect(result.baseScore).toBe(76);
      expect(result.weakAreas).toEqual([]);
      expect(result.penalty).toBe(0);
      expect(result.finalScore).toBe(76);
      expect(result.hasBlocker).toBe(false);
    });

    it('should identify weak areas and apply penalties', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 55,
        life_skills: 50,
      };

      const result = service.calculate(scores);

      // Weak areas: career_skills (55), life_skills (50)
      expect(result.weakAreas).toContain('career_skills');
      expect(result.weakAreas).toContain('life_skills');
      expect(result.penalty).toBe(10); // 2 weak areas * 5
      expect(result.finalScore).toBeLessThan(result.baseScore);
    });

    it('should detect blocker when any score < 40', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      const result = service.calculate(scores);

      expect(result.hasBlocker).toBe(true);
    });

    it('should calculate correctly for perfect scores', () => {
      const scores: CategoryScores = {
        academics: 100,
        career_skills: 100,
        life_skills: 100,
      };

      const result = service.calculate(scores);

      expect(result.baseScore).toBe(100);
      expect(result.finalScore).toBe(100);
      expect(result.weakAreas).toEqual([]);
      expect(result.penalty).toBe(0);
      expect(result.hasBlocker).toBe(false);
    });

    it('should handle minimum valid scores', () => {
      const scores: CategoryScores = {
        academics: 40,
        career_skills: 40,
        life_skills: 40,
      };

      const result = service.calculate(scores);

      expect(result.baseScore).toBe(40);
      expect(result.hasBlocker).toBe(false);
      // All are weak (< 60)
      expect(result.weakAreas.length).toBe(3);
      expect(result.penalty).toBe(15); // 3 * 5
    });
  });
});
