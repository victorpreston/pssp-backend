/**
 * AI service configuration for Vertex AI integration.
 * Environment variables required
 * - VERTEX_AI_PROJECT_ID: project id
 * - VERTEX_AI_LOCATION: location
 * - VERTEX_AI_MODEL: model
 */
export const aiConfig = {
  vertexAI: {
    projectId: process.env.VERTEX_AI_PROJECT_ID,
    location: process.env.VERTEX_AI_LOCATION || 'us-central1',
    model: process.env.VERTEX_AI_MODEL || 'gemini-pro',
  },
  generation: {
    temperature: 0.7,
    maxOutputTokens: 1024,
    topP: 0.95,
    topK: 40,
  },
  timeout: 10000,
  useMockInDev:
    process.env.NODE_ENV === 'development' && !process.env.VERTEX_AI_PROJECT_ID,
};
