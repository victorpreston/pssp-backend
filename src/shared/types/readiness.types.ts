export enum ReadinessLevel {
  NOT_READY = 'Not Ready',
  STARTING = 'Starting',
  DEVELOPING = 'Developing',
  BUILDING = 'Building',
  READY = 'Ready',
}

export enum CategoryStatus {
  STRONG = 'strong',
  BUILDING = 'building',
  DEVELOPING = 'developing',
  WEAK = 'weak',
}

export interface CategoryScore {
  score: number;
  weight: number;
  contribution: number;
  status: CategoryStatus;
  flagged?: boolean;
}

export interface ScoreBreakdown {
  academics: CategoryScore;
  career_skills: CategoryScore;
  life_skills: CategoryScore;
}

export interface ReadinessInsights {
  strengths: string[];
  growthAreas: string[];
  trend?: string;
  estimatedTimeToReady?: string;
}
