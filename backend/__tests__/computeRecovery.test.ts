import { computeRecovery } from '../src/computeRecovery';

describe('computeRecovery', () => {
  it('should return 0 score and confidence=0 if no data', () => {
    const result = computeRecovery({});
    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0);
  });

  it('should calculate score with only subjectiveMean', () => {
    const result = computeRecovery({ subjectiveMean: 7 });
    expect(result.score).toBeGreaterThan(80);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should calculate score with all components', () => {
    const result = computeRecovery({
      hrv: 70, hrvBaseline: 70,
      sleepH: 8, sleepBaselineH: 8,
      rhr: 50, rhrBaseline: 50,
      subjectiveMean: 6,
      tss3: 200, tss28Avg: 150
    });
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
