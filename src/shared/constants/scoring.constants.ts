export const CATEGORY_WEIGHTS = {
  academics: 0.35,
  career_skills: 0.4,
  life_skills: 0.25,
} as const;

export const THRESHOLDS = {
  WEAK_AREA: 60,
  BLOCKER: 40,
  READY: 75,
  BUILDING: 60,
  DEVELOPING: 40,
} as const;

export const PENALTIES = {
  WEAK_AREA: 5,
} as const;

export const SCORE_RANGE = {
  MIN: 0,
  MAX: 100,
} as const;
