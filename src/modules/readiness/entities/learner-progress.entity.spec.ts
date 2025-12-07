import { LearnerProgressEntity } from './learner-progress.entity';

describe('LearnerProgressEntity', () => {
  it('should create an entity with all properties', () => {
    const data = {
      id: 'test-id',
      academics: 80,
      career_skills: 70,
      life_skills: 75,
      overall_score: 75,
      readiness_level: 'Building',
      calculated_at: new Date(),
      learner_id: 'L001',
      program: 'TGP',
      goal: 'software_engineering',
    };

    const entity = new LearnerProgressEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.academics).toBe(data.academics);
    expect(entity.career_skills).toBe(data.career_skills);
    expect(entity.life_skills).toBe(data.life_skills);
    expect(entity.overall_score).toBe(data.overall_score);
    expect(entity.readiness_level).toBe(data.readiness_level);
    expect(entity.calculated_at).toBe(data.calculated_at);
    expect(entity.learner_id).toBe(data.learner_id);
    expect(entity.program).toBe(data.program);
    expect(entity.goal).toBe(data.goal);
  });

  it('should create an entity with partial properties', () => {
    const data = {
      id: 'test-id',
      academics: 80,
      career_skills: 70,
      life_skills: 75,
      overall_score: 75,
      readiness_level: 'Building',
      calculated_at: new Date(),
    };

    const entity = new LearnerProgressEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.academics).toBe(data.academics);
    expect(entity.learner_id).toBeUndefined();
    expect(entity.program).toBeUndefined();
    expect(entity.goal).toBeUndefined();
  });

  it('should create an entity with empty object', () => {
    const entity = new LearnerProgressEntity({});

    expect(entity.id).toBeUndefined();
    expect(entity.academics).toBeUndefined();
  });
});
