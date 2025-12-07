import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { aiConfig } from '../../../config/ai.config';
import { VertexAiGenerateContentResult } from '../interfaces/vertex-ai.interface';

/** Vertex AI client service for Gemini model interactions */
@Injectable()
export class VertexAiClientService implements OnModuleInit {
  private readonly logger = new Logger(VertexAiClientService.name);
  private vertexAI: VertexAI | null = null;
  private model: GenerativeModel | null = null;
  private initialized = false;

  onModuleInit() {
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      // Check if Vertex AI is enabled
      if (!aiConfig.enabled) {
        this.logger.warn('Vertex AI is disabled in configuration');
        return;
      }

      const { projectId, location, model, credentials } = aiConfig.vertexAI;

      if (!projectId || !location) {
        this.logger.warn(
          'Vertex AI configuration incomplete. AI recommendations will be disabled. ' +
            `Missing: ${!projectId ? 'GOOGLE_CLOUD_PROJECT ' : ''}${!location ? 'VERTEX_AI_LOCATION' : ''}`,
        );
        return;
      }

      // Set credentials - priority order:
      // 1. GOOGLE_SERVICE_ACCOUNT_JSON env var (parse and write to temp file)
      // 2. GOOGLE_APPLICATION_CREDENTIALS file path (legacy support)
      const jsonCreds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      const fileCreds = credentials;

      if (jsonCreds) {
        // Write JSON credentials to a temporary file for SDK to use
        const tempDir = tmpdir();
        const credsPath = join(tempDir, 'gcp-credentials.json');

        try {
          writeFileSync(credsPath, jsonCreds);
          process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;
          this.logger.log(
            'Using service account credentials from GOOGLE_SERVICE_ACCOUNT_JSON',
          );
        } catch (error) {
          this.logger.error('Failed to write credentials file', error);
          throw new Error('Failed to configure service account credentials');
        }
      } else if (fileCreds) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = fileCreds;
        this.logger.log(
          `Using service account credentials from file: ${fileCreds}`,
        );
      } else {
        this.logger.warn(
          'No service account credentials found. Vertex AI may fail to authenticate.',
        );
      }

      this.vertexAI = new VertexAI({
        project: projectId,
        location: location,
      });

      this.model = this.vertexAI.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature: aiConfig.generation.temperature,
          maxOutputTokens: 8192,
          topP: aiConfig.generation.topP,
          topK: aiConfig.generation.topK,
          responseMimeType: 'application/json',
        },
      });

      this.initialized = true;
      this.logger.log(
        `Vertex AI initialized successfully with model: ${model}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize Vertex AI client', error);
      this.initialized = false;
    }
  }

  /**
   * Generate content using Vertex AI Gemini model
   */
  async generateContent(prompt: string): Promise<string> {
    if (!this.initialized || !this.model) {
      throw new Error(
        'Vertex AI client is not initialized. Check configuration.',
      );
    }

    try {
      const result = (await this.model.generateContent(
        prompt,
      )) as unknown as VertexAiGenerateContentResult;

      // Log the full response structure for debugging
      this.logger.debug(
        'Vertex AI response structure:',
        JSON.stringify(result, null, 2),
      );

      const response = result.response;

      // Safe access to response text with proper null checking
      const candidates = response?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates in Vertex AI response');
      }

      const content = candidates[0]?.content;
      if (!content || !content.parts || content.parts.length === 0) {
        // Check finish reason for better error messages
        const finishReason = candidates[0]?.finishReason;
        this.logger.error(
          `No content parts in response. Finish reason: ${finishReason}`,
        );
        throw new Error(
          `No content parts in Vertex AI response. Finish reason: ${finishReason}`,
        );
      }

      const text = content.parts[0]?.text;
      if (!text) {
        throw new Error('No text in Vertex AI response');
      }

      return text;
    } catch (error) {
      this.logger.error('Error generating content from Vertex AI', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Vertex AI generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generate structured JSON response from Vertex AI
   */
  async generateStructuredContent<T>(prompt: string): Promise<T> {
    try {
      const text = await this.generateContent(prompt);

      // Log the raw response for debugging
      this.logger.debug('Raw Vertex AI response:', text.substring(0, 500));

      // Extract JSON from markdown code blocks if present
      let jsonText = text.trim();
      // Remove markdown code blocks
      if (jsonText.includes('```json')) {
        const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        jsonText = match ? match[1].trim() : jsonText;
      } else if (jsonText.includes('```')) {
        const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        jsonText = match ? match[1].trim() : jsonText;
      }

      // Find JSON array or object in the text
      const jsonMatch = jsonText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      // Clean up common issues
      // Remove control characters and trailing commas
      jsonText = jsonText
        .replace(/[\u0000-\u001F]+/g, '') // eslint-disable-line no-control-regex
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

      this.logger.debug('Cleaned JSON text:', jsonText.substring(0, 500));

      return JSON.parse(jsonText) as T;
    } catch (error) {
      this.logger.error(
        'Error parsing structured content from Vertex AI',
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to parse JSON response from Vertex AI: ${errorMessage}`,
      );
    }
  }
}
