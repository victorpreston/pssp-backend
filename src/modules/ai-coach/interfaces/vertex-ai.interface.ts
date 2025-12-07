/**
 * Type definitions for Vertex AI SDK responses
 * These provide type safety for the untyped @google-cloud/vertexai package
 */

export interface VertexAiTextPart {
  text: string;
}

export interface VertexAiContent {
  role: string;
  parts: VertexAiTextPart[];
}

export interface VertexAiCandidate {
  content: VertexAiContent;
  finishReason: string;
  index: number;
}

export interface VertexAiUsageMetadata {
  promptTokenCount: number;
  totalTokenCount: number;
  candidatesTokenCount?: number;
}

export interface VertexAiResponse {
  candidates: VertexAiCandidate[];
  usageMetadata: VertexAiUsageMetadata;
  modelVersion?: string;
}

export interface VertexAiGenerateContentResult {
  response: VertexAiResponse;
}
