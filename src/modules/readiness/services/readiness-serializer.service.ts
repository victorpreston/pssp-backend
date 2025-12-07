import { Injectable } from '@nestjs/common';
import { ReadinessResponseDto } from '../dto/readiness-response.dto';
import {
  CategoryScores,
  ScoringResult,
} from '../../../shared/types/scoring.types';
import { ReadinessLevel } from '../../../shared/types/readiness.types';
import {
  determineReadinessLevel,
  getCategoryStatus,
  calculateCategoryContribution,
} from '../../../shared/utils/scoring.utils';

/** Transforms scoring results into response format */
@Injectable()
export class ReadinessSerializerService {
  serialize(
    scores: CategoryScores,
    scoringResult: ScoringResult,
    previousScores?: Array<{ date: string; overall: number }>,
  ): ReadinessResponseDto {
    const readinessLevel = determineReadinessLevel(
      scoringResult.finalScore,
      scores,
      scoringResult.hasBlocker,
    );

    const insights = this.generateInsights(
      scores,
      scoringResult,
      readinessLevel,
      previousScores,
    );

    return {
      overall_score: scoringResult.finalScore,
      readiness_level: readinessLevel,
      category: this.getCategory(readinessLevel),
      breakdown: {
        academics: {
          score: scores.academics,
          weight: 0.35,
          contribution: calculateCategoryContribution(
            scores.academics,
            'academics',
          ),
          status: getCategoryStatus(scores.academics),
          flagged: scores.academics < 60,
        },
        career_skills: {
          score: scores.career_skills,
          weight: 0.4,
          contribution: calculateCategoryContribution(
            scores.career_skills,
            'career_skills',
          ),
          status: getCategoryStatus(scores.career_skills),
          flagged: scores.career_skills < 60,
        },
        life_skills: {
          score: scores.life_skills,
          weight: 0.25,
          contribution: calculateCategoryContribution(
            scores.life_skills,
            'life_skills',
          ),
          status: getCategoryStatus(scores.life_skills),
          flagged: scores.life_skills < 60,
        },
      },
      insights,
      calculated_at: new Date().toISOString(),
    };
  }

  private getCategory(level: ReadinessLevel): string {
    const categoryMap = {
      [ReadinessLevel.READY]: 'Advanced',
      [ReadinessLevel.BUILDING]: 'Intermediate',
      [ReadinessLevel.DEVELOPING]: 'Beginner',
      [ReadinessLevel.STARTING]: 'Foundation',
      [ReadinessLevel.NOT_READY]: 'Pre-Foundation',
    };
    return categoryMap[level];
  }

  private generateInsights(
    scores: CategoryScores,
    scoringResult: ScoringResult,
    level: ReadinessLevel,
    previousScores?: Array<{ date: string; overall: number }>,
  ) {
    const strengths: string[] = [];
    const growthAreas: string[] = [];

    Object.entries(scores).forEach(([category, score]) => {
      if (score >= 75) {
        strengths.push(category);
      } else if (score < 60) {
        growthAreas.push(category);
      }
    });

    const insights: {
      strengths: string[];
      growthAreas: string[];
      trend?: string;
      estimatedTimeToReady?: string;
    } = {
      strengths,
      growthAreas,
    };

    if (previousScores && previousScores.length > 0) {
      const lastScore = previousScores[previousScores.length - 1].overall;
      const difference = scoringResult.finalScore - lastScore;
      if (difference > 0) {
        insights.trend = `improving (+${difference} points from last assessment)`;
      } else if (difference < 0) {
        insights.trend = `declining (${difference} points from last assessment)`;
      } else {
        insights.trend = 'stable (no change from last assessment)';
      }
    }

    if (level !== ReadinessLevel.READY) {
      const pointsNeeded = 75 - scoringResult.finalScore;
      const weeksEstimate = Math.ceil(pointsNeeded / 2);
      insights.estimatedTimeToReady = `${weeksEstimate}-${weeksEstimate + 2} weeks with consistent engagement`;
    }

    return insights;
  }
}
