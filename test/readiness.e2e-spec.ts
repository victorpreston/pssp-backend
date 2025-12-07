/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AiCoachService } from '../src/modules/ai-coach/services/ai-coach.service';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Readiness Module (e2e)', () => {
  let app: INestApplication<App>;
  let aiCoachService: AiCoachService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiCoachService)
      .useValue({
        // Mock AI service to avoid actual api calls in tests
        generateRecommendations: jest.fn().mockResolvedValue([]),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    // apply global settings as in main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    aiCoachService = moduleFixture.get<AiCoachService>(AiCoachService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/readiness/calculate', () => {
    it('should calculate readiness with valid scores', () => {
      const requestBody = {
        academics: 80,
        career_skills: 70,
        life_skills: 75,
        program: 'Software Engineering',
        goal: 'Secure internship at tech company',
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('overall_score');
          expect(res.body.data).toHaveProperty('readiness_level');
          expect(res.body.data).toHaveProperty('category');
          expect(res.body.data).toHaveProperty('breakdown');
          expect(res.body.data).toHaveProperty('insights');
          expect(res.body.data).toHaveProperty('ai_recommendations');

          // verify score calculation
          expect(res.body.data.overall_score).toBeGreaterThanOrEqual(0);
          expect(res.body.data.overall_score).toBeLessThanOrEqual(100);

          // verify breakdown structure
          expect(res.body.data.breakdown).toHaveProperty('academics');
          expect(res.body.data.breakdown).toHaveProperty('career_skills');
          expect(res.body.data.breakdown).toHaveProperty('life_skills');

          // verify AI recommendations (mocked to return empty array)
          expect(Array.isArray(res.body.data.ai_recommendations)).toBe(true);
        });
    });

    it('should handle high-performing student (READY level)', () => {
      const requestBody = {
        academics: 90,
        career_skills: 85,
        life_skills: 80,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.readiness_level).toBe('Ready');
          expect(res.body.data.category).toBe('Advanced');
          expect(res.body.data.overall_score).toBeGreaterThan(75);
        });
    });

    it('should handle student with weak areas', () => {
      const requestBody = {
        academics: 80,
        career_skills: 55,
        life_skills: 50,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.insights.growthAreas.length).toBeGreaterThan(0);
          expect(
            res.body.data.insights.growthAreas.some((area: string) =>
              ['career_skills', 'life_skills'].includes(area),
            ),
          ).toBe(true);
        });
    });

    it('should detect blocker when score < 40', () => {
      const requestBody = {
        academics: 80,
        career_skills: 70,
        life_skills: 35,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.readiness_level).toBe('Not Ready');
          expect(res.body.data.breakdown.life_skills.flagged).toBe(true);
        });
    });

    it('should reject invalid scores (> 100)', () => {
      const requestBody = {
        academics: 150,
        career_skills: 70,
        life_skills: 75,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(400);
    });

    it('should reject invalid scores (< 0)', () => {
      const requestBody = {
        academics: 80,
        career_skills: -10,
        life_skills: 75,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(400);
    });

    it('should reject missing required fields', () => {
      const requestBody = {
        academics: 80,
        // missing career_skills and life_skills
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(400);
    });

    it('should handle optional program and goal fields', () => {
      const requestBody = {
        academics: 70,
        career_skills: 65,
        life_skills: 68,
        // no program or goal provided
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('overall_score');
        });
    });

    it('should verify AI service is called when enabled', () => {
      const requestBody = {
        academics: 75,
        career_skills: 70,
        life_skills: 72,
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .then(() => {
          // verify AI service was called (mocked)
          expect(aiCoachService.generateRecommendations).toHaveBeenCalled();
        });
    });

    it('should calculate correct weighted contributions', () => {
      const requestBody = {
        academics: 80, // 35% weight
        career_skills: 60, // 40% weight
        life_skills: 70, // 25% weight
      };

      return request(app.getHttpServer())
        .post('/api/readiness/calculate')
        .send(requestBody)
        .expect(201)
        .expect((res) => {
          const breakdown = res.body.data.breakdown;

          // verify weighted contributions
          expect(breakdown.academics.contribution).toBe(28); // 80 * 0.35
          expect(breakdown.career_skills.contribution).toBe(24); // 60 * 0.4
          expect(breakdown.life_skills.contribution).toBe(17.5); // 70 * 0.25
        });
    });
  });
});
