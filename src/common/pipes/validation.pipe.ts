import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

/**
 * Global validation pipe configuration
 * Validates and transforms DTOs using class-validator
 */
export const validationPipeConfig = new NestValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
