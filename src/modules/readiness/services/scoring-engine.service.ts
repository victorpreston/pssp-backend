import { Injectable } from '@nestjs/common';
import {
  CategoryScores,
  ScoringResult,
} from '../../../shared/types/scoring.types';
import { calculateScore } from '../../../shared/utils/scoring.utils';

/** Calculates readiness scores using configured scoring strategy */
@Injectable()
export class ScoringEngineService {
  calculate(scores: CategoryScores): ScoringResult {
    return calculateScore(scores);
  }
}
