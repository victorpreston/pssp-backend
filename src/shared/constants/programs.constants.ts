/**
 * PSSP program definitions.
 */
export const PROGRAMS = {
  PSP: 'Post School Prep',
  TGP: 'The Graduate Platform',
  IP: 'Innovator Pathways',
} as const;

/**
 * Supported career goal categories.
 * Used for personalized recommendations and pathway mapping.
 */
export const CAREER_GOALS = [
  'software_engineering',
  'business_development',
  'entrepreneurship',
  'further_education',
  'creative_arts',
  'healthcare',
  'other',
] as const;
