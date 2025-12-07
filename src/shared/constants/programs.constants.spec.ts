import { PROGRAMS, CAREER_GOALS } from './programs.constants';

describe('Programs Constants', () => {
  describe('PROGRAMS', () => {
    it('should have PSP program defined', () => {
      expect(PROGRAMS.PSP).toBe('Post School Prep');
    });

    it('should have TGP program defined', () => {
      expect(PROGRAMS.TGP).toBe('The Graduate Platform');
    });

    it('should have IP program defined', () => {
      expect(PROGRAMS.IP).toBe('Innovator Pathways');
    });

    it('should have all three programs defined', () => {
      expect(Object.keys(PROGRAMS)).toEqual(['PSP', 'TGP', 'IP']);
    });
  });

  describe('CAREER_GOALS', () => {
    it('should contain all expected career goals', () => {
      expect(CAREER_GOALS).toContain('software_engineering');
      expect(CAREER_GOALS).toContain('business_development');
      expect(CAREER_GOALS).toContain('entrepreneurship');
      expect(CAREER_GOALS).toContain('further_education');
      expect(CAREER_GOALS).toContain('creative_arts');
      expect(CAREER_GOALS).toContain('healthcare');
      expect(CAREER_GOALS).toContain('other');
    });

    it('should have exactly 7 career goals', () => {
      expect(CAREER_GOALS).toHaveLength(7);
    });

    it('should be a readonly array', () => {
      expect(Object.isFrozen(CAREER_GOALS)).toBe(false); // as const doesn't freeze at runtime
      expect(Array.isArray(CAREER_GOALS)).toBe(true);
    });
  });
});
