import { Module } from '@nestjs/common';
import { AiCoachService } from './ai-coach.service';
import { AiCoachController } from './ai-coach.controller';

@Module({
  controllers: [AiCoachController],
  providers: [AiCoachService],
})
export class AiCoachModule {}
