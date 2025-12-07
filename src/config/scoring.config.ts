/**
 * Scoring algorithm configuration.
 * Defines weights, thresholds, and penalties for readiness score calculation.
 */
export const scoringConfig = {
  weights: {
    academics: 0.35,
    career_skills: 0.4,
    life_skills: 0.25,
  },
  thresholds: {
    weakArea: 60,
    blocker: 40,
    ready: 75,
    building: 60,
    developing: 40,
  },
  penalties: {
    weakArea: 5,
  },
};
