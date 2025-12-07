import { CategoryScores } from '../types/scoring.types';
import { SCORE_RANGE } from '../constants/scoring.constants';

/** Validates that all category scores are within valid range */
export function validateScores(scores: CategoryScores): string[] {
  const errors: string[] = [];

  Object.entries(scores).forEach(([category, score]) => {
    if (typeof score !== 'number') {
      errors.push(`${category} must be a number`);
    } else if (score < SCORE_RANGE.MIN || score > SCORE_RANGE.MAX) {
      errors.push(
        `${category} must be between ${SCORE_RANGE.MIN} and ${SCORE_RANGE.MAX}`,
      );
    }
  });

  return errors;
}

export function sanitizeInput<T extends Record<string, unknown>>(input: T): T {
  const sanitized = { ...input } as Record<string, unknown>;

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    }
  });

  return sanitized as T;
}
