/** Represents a learner's progress assessment with historical tracking */
export class LearnerProgressEntity {
  id: string;
  academics: number;
  career_skills: number;
  life_skills: number;
  overall_score: number;
  readiness_level: string;
  calculated_at: Date;
  learner_id?: string;
  program?: string;
  goal?: string;

  constructor(partial: Partial<LearnerProgressEntity>) {
    Object.assign(this, partial);
  }
}
