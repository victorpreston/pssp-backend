import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { validationPipeConfig } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global middleware
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(validationPipeConfig);
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix(appConfig.apiPrefix);

  const config = new DocumentBuilder()
    .setTitle('PSSP Readiness API')
    .setDescription(
      'Post-School Success Platform API for calculating learner readiness scores and AI-powered coaching recommendations',
    )
    .setVersion('1.0')
    .setContact(
      'Victor Preston',
      'https://victorpreston.dev',
      'https://github.com/victorpreston',
    )
    .addTag('readiness', 'Readiness score calculation endpoints')
    .addTag('ai-coach', 'AI-powered coaching and recommendations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.port);
  console.log(`Application running on: http://localhost:${appConfig.port}`);
  console.log(`API Documentation: http://localhost:${appConfig.port}/docs`);
}

void bootstrap();
