import {
  CATEGORY_WEIGHTS,
  THRESHOLDS,
  PENALTIES,
  SCORE_RANGE,
} from '../constants/scoring.constants';
import { CategoryScores, ScoringResult } from '../types/scoring.types';
import { CategoryStatus, ReadinessLevel } from '../types/readiness.types';

export function calculateWeightedAverage(scores: CategoryScores): number {
  const { academics, career_skills, life_skills } = scores;

  return (
    academics * CATEGORY_WEIGHTS.academics +
    career_skills * CATEGORY_WEIGHTS.career_skills +
    life_skills * CATEGORY_WEIGHTS.life_skills
  );
}

export function identifyWeakAreas(scores: CategoryScores): string[] {
  const weakAreas: string[] = [];

  Object.entries(scores).forEach(([category, score]) => {
    if (score < THRESHOLDS.WEAK_AREA) {
      weakAreas.push(category);
    }
  });

  return weakAreas;
}

export function applyPenalty(baseScore: number, weakAreaCount: number): number {
  const penalty = weakAreaCount * PENALTIES.WEAK_AREA;
  return Math.max(SCORE_RANGE.MIN, baseScore - penalty);
}

export function hasBlocker(scores: CategoryScores): boolean {
  return Object.values(scores).some((score) => score < THRESHOLDS.BLOCKER);
}

export function determineReadinessLevel(
  finalScore: number,
  scores: CategoryScores,
  hasBlockerFlag: boolean,
): ReadinessLevel {
  if (hasBlockerFlag) {
    return ReadinessLevel.NOT_READY;
  }

  const allAboveThreshold = Object.values(scores).every(
    (score) => score >= THRESHOLDS.WEAK_AREA + 5,
  );

  if (finalScore >= THRESHOLDS.READY && allAboveThreshold) {
    return ReadinessLevel.READY;
  }

  if (finalScore >= THRESHOLDS.BUILDING) {
    return ReadinessLevel.BUILDING;
  }

  if (finalScore >= THRESHOLDS.DEVELOPING) {
    return ReadinessLevel.DEVELOPING;
  }

  return ReadinessLevel.STARTING;
}

export function getCategoryStatus(score: number): CategoryStatus {
  if (score >= THRESHOLDS.READY) {
    return CategoryStatus.STRONG;
  }

  if (score >= THRESHOLDS.BUILDING) {
    return CategoryStatus.BUILDING;
  }

  if (score >= THRESHOLDS.WEAK_AREA) {
    return CategoryStatus.DEVELOPING;
  }

  return CategoryStatus.WEAK;
}

export function calculateCategoryContribution(
  score: number,
  category: keyof CategoryScores,
): number {
  return score * CATEGORY_WEIGHTS[category];
}

export function validateScoreRange(score: number): boolean {
  return score >= SCORE_RANGE.MIN && score <= SCORE_RANGE.MAX;
}

export function normalizeScore(score: number): number {
  return Math.max(
    SCORE_RANGE.MIN,
    Math.min(SCORE_RANGE.MAX, Math.round(score)),
  );
}

export function calculateScore(scores: CategoryScores): ScoringResult {
  const baseScore = calculateWeightedAverage(scores);
  const weakAreas = identifyWeakAreas(scores);
  const penalty = weakAreas.length * PENALTIES.WEAK_AREA;
  const finalScore = normalizeScore(baseScore - penalty);
  const hasBlockerFlag = hasBlocker(scores);

  return {
    baseScore: normalizeScore(baseScore),
    finalScore,
    penalty,
    weakAreas,
    hasBlocker: hasBlockerFlag,
  };
}
