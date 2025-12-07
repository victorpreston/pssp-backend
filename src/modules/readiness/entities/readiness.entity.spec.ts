import { Readiness } from './readiness.entity';

describe('Readiness', () => {
  it('should create an instance', () => {
    const entity = new Readiness();
    expect(entity).toBeDefined();
    expect(entity).toBeInstanceOf(Readiness);
  });
});
