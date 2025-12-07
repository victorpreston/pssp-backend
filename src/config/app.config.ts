/**
 * Application configuration settings.
 */
export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: 'api',
  corsEnabled: true,
};
