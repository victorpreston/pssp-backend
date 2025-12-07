import { Module } from '@nestjs/common';
import { ReadinessService } from './services/readiness.service';
import { ScoringEngineService } from './services/scoring-engine.service';
import { ReadinessSerializerService } from './services/readiness-serializer.service';
import { ReadinessController } from './readiness.controller';

@Module({
  controllers: [ReadinessController],
  providers: [
    ReadinessService,
    ScoringEngineService,
    ReadinessSerializerService,
  ],
  exports: [ReadinessService],
})
export class ReadinessModule {}
