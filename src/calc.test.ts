import { describe, expect, it } from "vitest";
import { calculate, DEFAULT_ANSWERS, topCategory } from "./calc";

describe("calculate", () => {
  it("adds up all categories into the total", () => {
    const r = calculate(DEFAULT_ANSWERS);
    const sum = Object.values(r.breakdown).reduce((a, b) => a + b, 0);
    expect(r.total).toBeCloseTo(sum);
  });

  it("treats negative or invalid numbers as zero", () => {
    const r = calculate({ ...DEFAULT_ANSWERS, carKmPerWeek: -50, busKmPerWeek: NaN });
    expect(r.breakdown.Transport).toBe(0);
  });

  it("more driving never lowers the footprint", () => {
    const low = calculate({ ...DEFAULT_ANSWERS, carKmPerWeek: 10 });
    const high = calculate({ ...DEFAULT_ANSWERS, carKmPerWeek: 100 });
    expect(high.total).toBeGreaterThan(low.total);
  });

  it("finds the largest category", () => {
    const r = calculate({ ...DEFAULT_ANSWERS, flightsPerYear: 10 });
    expect(topCategory(r)).toBe("Transport");
  });
});
