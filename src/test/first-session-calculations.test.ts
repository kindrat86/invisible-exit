import { describe, it, expect } from 'vitest';
import { monthsToTarget, calculateFreedomNumber, projectRevenue } from '../lib/fym-calculations';

describe('synthetic first-session financial walkthrough', () => {
  it('reports an already reached target as zero months even at zero growth', () => {
    expect(monthsToTarget(3600, 0, 3600)).toBe(0);
  });
  it('does not project reaching an unmet target with no growth or no revenue', () => {
    expect(monthsToTarget(100, 0, 3600)).toBeNull();
    expect(monthsToTarget(0, 10, 3600)).toBeNull();
  });
  it('keeps three-year capital distinct from a monthly income target', () => {
    expect(calculateFreedomNumber(3000)).toBe(108000);
    expect(projectRevenue(0, 10, 3)).toEqual([0, 0, 0, 0]);
  });
});
