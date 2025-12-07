/**
 * AI service configuration for Vertex AI integration.
 * Loads from .env.local file
 */
export const aiConfig = {
  vertexAI: {
    get projectId() {
      return (
        process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_AI_PROJECT_ID
      );
    },
    get location() {
      return process.env.VERTEX_AI_LOCATION || 'us-central1';
    },
    get model() {
      return process.env.VERTEX_AI_MODEL || 'gemini-2.0-flash-exp';
    },
    get credentials() {
      return process.env.GOOGLE_APPLICATION_CREDENTIALS;
    },
  },
  generation: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.95,
    topK: 40,
  },
  timeout: 30000,
  get enabled() {
    return process.env.ENABLE_VERTEX_AI === 'true';
  },
};
