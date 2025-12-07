export interface CategoryScores {
  academics: number;
  career_skills: number;
  life_skills: number;
}

export interface ScoringResult {
  baseScore: number;
  finalScore: number;
  penalty: number;
  weakAreas: string[];
  hasBlocker: boolean;
}

export interface ScoringStrategy {
  calculate(scores: CategoryScores): ScoringResult;
}
