import { Module } from '@nestjs/common';
import { AiCoachService } from './services/ai-coach.service';
import { VertexAiClientService } from './services/vertex-ai-client.service';
import { PromptBuilderService } from './services/prompt-builder.service';

@Module({
  providers: [AiCoachService, VertexAiClientService, PromptBuilderService],
  exports: [AiCoachService],
})
export class AiCoachModule {}
