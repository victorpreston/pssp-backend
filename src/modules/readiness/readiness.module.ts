import { Module } from '@nestjs/common';
import { ReadinessService } from './services/readiness.service';
import { ScoringEngineService } from './services/scoring-engine.service';
import { ReadinessSerializerService } from './services/readiness-serializer.service';
import { ReadinessController } from './readiness.controller';
import { AiCoachModule } from '../ai-coach/ai-coach.module';

@Module({
  imports: [AiCoachModule],
  controllers: [ReadinessController],
  providers: [
    ReadinessService,
    ScoringEngineService,
    ReadinessSerializerService,
  ],
  exports: [ReadinessService],
})
export class ReadinessModule {}
