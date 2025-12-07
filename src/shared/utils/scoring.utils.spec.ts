import {
  calculateWeightedAverage,
  identifyWeakAreas,
  applyPenalty,
  hasBlocker,
  determineReadinessLevel,
  getCategoryStatus,
  calculateCategoryContribution,
  validateScoreRange,
  normalizeScore,
  calculateScore,
} from './scoring.utils';
import { CategoryScores } from '../types/scoring.types';
import { CategoryStatus, ReadinessLevel } from '../types/readiness.types';
import { CATEGORY_WEIGHTS } from '../constants/scoring.constants';

describe('Scoring Utils', () => {
  describe('calculateWeightedAverage', () => {
    it('should calculate correct weighted average for balanced scores', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 75,
      };

      // Expected: 80*0.35 + 70*0.4 + 75*0.25 = 28 + 28 + 18.75 = 74.75
      const result = calculateWeightedAverage(scores);
      expect(result).toBe(74.75);
    });

    it('should calculate weighted average with different score distributions', () => {
      const scores: CategoryScores = {
        academics: 100,
        career_skills: 50,
        life_skills: 60,
      };

      // Expected: 100*0.35 + 50*0.4 + 60*0.25 = 35 + 20 + 15 = 70
      const result = calculateWeightedAverage(scores);
      expect(result).toBe(70);
    });
  });

  describe('identifyWeakAreas', () => {
    it('should identify categories below threshold (60)', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 55,
        life_skills: 45,
      };

      const weakAreas = identifyWeakAreas(scores);
      expect(weakAreas).toEqual(['career_skills', 'life_skills']);
    });

    it('should return empty array when no weak areas', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 65,
      };

      const weakAreas = identifyWeakAreas(scores);
      expect(weakAreas).toEqual([]);
    });

    it('should identify all categories as weak if all below threshold', () => {
      const scores: CategoryScores = {
        academics: 50,
        career_skills: 45,
        life_skills: 55,
      };

      const weakAreas = identifyWeakAreas(scores);
      expect(weakAreas).toHaveLength(3);
      expect(weakAreas).toContain('academics');
      expect(weakAreas).toContain('career_skills');
      expect(weakAreas).toContain('life_skills');
    });
  });

  describe('applyPenalty', () => {
    it('should apply penalty correctly for multiple weak areas', () => {
      const baseScore = 75;
      const weakAreaCount = 2;

      // Expected: 75 - (2 * 5) = 65
      const result = applyPenalty(baseScore, weakAreaCount);
      expect(result).toBe(65);
    });

    it('should not allow score to go below minimum (0)', () => {
      const baseScore = 5;
      const weakAreaCount = 3;

      // Expected: max(0, 5 - 15) = 0
      const result = applyPenalty(baseScore, weakAreaCount);
      expect(result).toBe(0);
    });

    it('should return original score when no weak areas', () => {
      const baseScore = 80;
      const weakAreaCount = 0;

      const result = applyPenalty(baseScore, weakAreaCount);
      expect(result).toBe(80);
    });
  });

  describe('hasBlocker', () => {
    it('should return true when any score is below blocker threshold (40)', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      const result = hasBlocker(scores);
      expect(result).toBe(true);
    });

    it('should return false when all scores are above blocker threshold', () => {
      const scores: CategoryScores = {
        academics: 50,
        career_skills: 60,
        life_skills: 45,
      };

      const result = hasBlocker(scores);
      expect(result).toBe(false);
    });

    it('should return true when score equals blocker threshold (edge case)', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 39,
      };

      const result = hasBlocker(scores);
      expect(result).toBe(true);
    });
  });

  describe('determineReadinessLevel', () => {
    it('should return NOT_READY when blocker flag is true', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      const result = determineReadinessLevel(75, scores, true);
      expect(result).toBe(ReadinessLevel.NOT_READY);
    });

    it('should return READY when score >= 75 and all categories strong', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 75,
        life_skills: 70,
      };

      const result = determineReadinessLevel(77, scores, false);
      expect(result).toBe(ReadinessLevel.READY);
    });

    it('should return BUILDING when score >= 60 and < 75', () => {
      const scores: CategoryScores = {
        academics: 70,
        career_skills: 60,
        life_skills: 65,
      };

      const result = determineReadinessLevel(65, scores, false);
      expect(result).toBe(ReadinessLevel.BUILDING);
    });

    it('should return DEVELOPING when score >= 40 and < 60', () => {
      const scores: CategoryScores = {
        academics: 50,
        career_skills: 45,
        life_skills: 55,
      };

      const result = determineReadinessLevel(50, scores, false);
      expect(result).toBe(ReadinessLevel.DEVELOPING);
    });

    it('should return STARTING when score < 40', () => {
      const scores: CategoryScores = {
        academics: 30,
        career_skills: 35,
        life_skills: 40,
      };

      const result = determineReadinessLevel(35, scores, false);
      expect(result).toBe(ReadinessLevel.STARTING);
    });
  });

  describe('getCategoryStatus', () => {
    it('should return STRONG for scores >= 75', () => {
      expect(getCategoryStatus(75)).toBe(CategoryStatus.STRONG);
      expect(getCategoryStatus(90)).toBe(CategoryStatus.STRONG);
    });

    it('should return BUILDING for scores >= 60 and < 75', () => {
      expect(getCategoryStatus(60)).toBe(CategoryStatus.BUILDING);
      expect(getCategoryStatus(70)).toBe(CategoryStatus.BUILDING);
    });

    it('should return DEVELOPING for scores >= 60 and < 60', () => {
      expect(getCategoryStatus(60)).toBe(CategoryStatus.BUILDING);
    });

    it('should return WEAK for scores < 60', () => {
      expect(getCategoryStatus(59)).toBe(CategoryStatus.WEAK);
      expect(getCategoryStatus(40)).toBe(CategoryStatus.WEAK);
    });
  });

  describe('calculateCategoryContribution', () => {
    it('should calculate academics contribution correctly (35%)', () => {
      const result = calculateCategoryContribution(80, 'academics');
      expect(result).toBe(80 * CATEGORY_WEIGHTS.academics);
      expect(result).toBe(28);
    });

    it('should calculate career_skills contribution correctly (40%)', () => {
      const result = calculateCategoryContribution(70, 'career_skills');
      expect(result).toBe(70 * CATEGORY_WEIGHTS.career_skills);
      expect(result).toBe(28);
    });

    it('should calculate life_skills contribution correctly (25%)', () => {
      const result = calculateCategoryContribution(60, 'life_skills');
      expect(result).toBe(60 * CATEGORY_WEIGHTS.life_skills);
      expect(result).toBe(15);
    });
  });

  describe('validateScoreRange', () => {
    it('should return true for valid scores (0-100)', () => {
      expect(validateScoreRange(0)).toBe(true);
      expect(validateScoreRange(50)).toBe(true);
      expect(validateScoreRange(100)).toBe(true);
    });

    it('should return false for scores below 0', () => {
      expect(validateScoreRange(-1)).toBe(false);
      expect(validateScoreRange(-50)).toBe(false);
    });

    it('should return false for scores above 100', () => {
      expect(validateScoreRange(101)).toBe(false);
      expect(validateScoreRange(150)).toBe(false);
    });
  });

  describe('normalizeScore', () => {
    it('should round and keep valid scores unchanged', () => {
      expect(normalizeScore(75.4)).toBe(75);
      expect(normalizeScore(75.6)).toBe(76);
    });

    it('should cap scores above 100 to 100', () => {
      expect(normalizeScore(105)).toBe(100);
      expect(normalizeScore(150)).toBe(100);
    });

    it('should floor scores below 0 to 0', () => {
      expect(normalizeScore(-5)).toBe(0);
      expect(normalizeScore(-50)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(normalizeScore(0)).toBe(0);
      expect(normalizeScore(100)).toBe(100);
    });
  });

  describe('calculateScore - Integration', () => {
    it('should calculate complete scoring result correctly', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 60,
        life_skills: 70,
      };

      const result = calculateScore(scores);

      // Base: 80*0.35 + 60*0.4 + 70*0.25 = 28 + 24 + 17.5 = 69.5 -> 70
      expect(result.baseScore).toBe(70);

      // Weak areas: career_skills (60) is NOT weak (threshold is < 60)
      // So penalty = 0
      expect(result.weakAreas).toEqual([]);
      expect(result.penalty).toBe(0);
      expect(result.finalScore).toBe(70);
      expect(result.hasBlocker).toBe(false);
    });

    it('should apply penalties for weak areas', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 55,
        life_skills: 45,
      };

      const result = calculateScore(scores);

      // Weak areas: career_skills (55), life_skills (45)
      expect(result.weakAreas).toEqual(['career_skills', 'life_skills']);
      expect(result.penalty).toBe(10); // 2 weak areas * 5
      expect(result.hasBlocker).toBe(false);
    });

    it('should detect blocker when score < 40', () => {
      const scores: CategoryScores = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      const result = calculateScore(scores);

      expect(result.hasBlocker).toBe(true);
      expect(result.weakAreas).toContain('life_skills');
    });
  });
});
