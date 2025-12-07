import { Module } from '@nestjs/common';
import { ReadinessService } from './readiness.service';
import { ReadinessController } from './readiness.controller';

@Module({
  controllers: [ReadinessController],
  providers: [ReadinessService],
})
export class ReadinessModule {}
