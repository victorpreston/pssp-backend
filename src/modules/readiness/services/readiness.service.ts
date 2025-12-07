import { Injectable } from '@nestjs/common';
import { CalculateReadinessDto } from '../dto/calculate-readiness.dto';
import { ReadinessResponseDto } from '../dto/readiness-response.dto';
import { ScoringEngineService } from './scoring-engine.service';
import { ReadinessSerializerService } from './readiness-serializer.service';
import { CategoryScores } from '../../../shared/types/scoring.types';

/** Orchestrates readiness score calculation and response generation */
@Injectable()
export class ReadinessService {
  constructor(
    private readonly scoringEngine: ScoringEngineService,
    private readonly serializer: ReadinessSerializerService,
  ) {}

  async calculateReadiness(
    dto: CalculateReadinessDto,
  ): Promise<ReadinessResponseDto> {
    const scores: CategoryScores = {
      academics: dto.academics,
      career_skills: dto.career_skills,
      life_skills: dto.life_skills,
    };

    const scoringResult = this.scoringEngine.calculate(scores);

    return this.serializer.serialize(
      scores,
      scoringResult,
      dto.previous_scores,
      dto.context?.program,
      dto.context?.goal,
    );
  }
}
