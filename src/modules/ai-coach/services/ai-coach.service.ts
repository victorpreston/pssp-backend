import { Injectable, Logger } from '@nestjs/common';
import { VertexAiClientService } from './vertex-ai-client.service';
import { PromptBuilderService } from './prompt-builder.service';
import { AIRecommendationDto } from '../dto/recommendation.dto';
import { CategoryScores } from '../../../shared/types/scoring.types';
import { ReadinessLevel } from '../../../shared/types/readiness.types';
import { aiConfig } from '../../../config/ai.config';

interface RecommendationRequest {
  scores: CategoryScores;
  overall_score: number;
  readiness_level: ReadinessLevel;
  strengths: string[];
  growthAreas: string[];
  program?: string;
  goal?: string;
}

/** Main AI Coach service for generating personalized recommendations */
@Injectable()
export class AiCoachService {
  private readonly logger = new Logger(AiCoachService.name);

  constructor(
    private readonly vertexAiClient: VertexAiClientService,
    private readonly promptBuilder: PromptBuilderService,
  ) {}

  /**
   * Generate personalized recommendations based on readiness assessment
   */
  async generateRecommendations(
    request: RecommendationRequest,
  ): Promise<AIRecommendationDto[]> {
    if (!aiConfig.enabled) {
      this.logger.warn(
        'Vertex AI is disabled, returning empty recommendations',
      );
      return [];
    }

    try {
      this.logger.log(
        `Generating recommendations for learner with overall score: ${request.overall_score}`,
      );

      // Build the prompt
      const prompt = this.promptBuilder.buildRecommendationPrompt(request);

      // Generate recommendations from Vertex AI
      const recommendations =
        await this.vertexAiClient.generateStructuredContent<
          AIRecommendationDto[]
        >(prompt);

      this.logger.log(
        `Successfully generated ${recommendations.length} recommendations`,
      );

      return recommendations;
    } catch (error) {
      this.logger.error('Failed to generate recommendations', error);

      // Log the error but don't fail the request
      // Return empty array so readiness calculation still works
      return [];
    }
  }

  /**
   * Test the AI integration
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    model?: string;
  }> {
    try {
      if (!aiConfig.enabled) {
        return {
          success: false,
          message: 'Vertex AI is disabled in configuration',
        };
      }

      const testPrompt = this.promptBuilder.buildTestPrompt();
      await this.vertexAiClient.generateContent(testPrompt);

      return {
        success: true,
        message: 'Vertex AI connection successful',
        model: aiConfig.vertexAI.model,
      };
    } catch (error) {
      this.logger.error('Vertex AI connection test failed', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Connection failed: ${errorMessage}`,
      };
    }
  }
}
