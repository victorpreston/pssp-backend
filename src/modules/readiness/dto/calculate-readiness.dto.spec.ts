import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CalculateReadinessDto } from './calculate-readiness.dto';

describe('CalculateReadinessDto', () => {
  it('should validate a complete DTO with all fields', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      learner_id: 'L001',
      academics: 80,
      career_skills: 60,
      life_skills: 70,
      details: {
        academics: {
          stem_proficiency: 85,
          literacy: 75,
          critical_thinking: 80,
        },
        career_skills: {
          resume_building: 70,
          interview_prep: 50,
          networking: 60,
        },
        life_skills: {
          time_management: 75,
          communication: 70,
          financial_literacy: 65,
        },
      },
      context: {
        learner_id: 'L12345',
        program: 'TGP',
        goal: 'software_engineering',
        modules_completed: 12,
        engagement_score: 85,
      },
      previous_scores: [
        {
          date: '2024-11-01',
          overall: 62,
        },
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with only required fields', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      academics: 80,
      career_skills: 60,
      life_skills: 70,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject invalid score ranges', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      academics: 150,
      career_skills: -10,
      life_skills: 70,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate nested details object', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      academics: 80,
      career_skills: 60,
      life_skills: 70,
      details: {
        academics: {
          stem_proficiency: 85,
        },
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate context with partial fields', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      academics: 80,
      career_skills: 60,
      life_skills: 70,
      context: {
        program: 'PSP',
        goal: 'entrepreneurship',
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate previous_scores array', async () => {
    const dto = plainToInstance(CalculateReadinessDto, {
      academics: 80,
      career_skills: 60,
      life_skills: 70,
      previous_scores: [
        { date: '2024-11-01', overall: 62 },
        { date: '2024-10-01', overall: 55 },
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
