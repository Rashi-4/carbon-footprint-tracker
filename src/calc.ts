// Emission factors are approximate, rounded values for estimation only.
// Replace them with sourced figures (e.g. your national grid factor) before quoting results.
export type Answers = {
  carKmPerWeek: number;
  busKmPerWeek: number;
  flightsPerYear: number;
  electricityKwhPerMonth: number;
  lpgCylindersPerYear: number;
  diet: "vegan" | "vegetarian" | "mixed" | "meat-heavy";
  shoppingPerMonth: "low" | "medium" | "high";
};

export type Category = "Transport" | "Home energy" | "Food" | "Shopping";

export type Result = {
  total: number; // kg CO2e per year
  breakdown: Record<Category, number>;
};

export const FACTORS = {
  carKm: 0.17, // kg CO2e per km, average petrol car
  busKm: 0.09, // kg CO2e per passenger km
  flight: 250, // kg CO2e per short domestic flight (one way)
  electricityKwh: 0.7, // kg CO2e per kWh, approximate grid average
  lpgCylinder: 42, // kg CO2e per 14.2 kg cylinder
  diet: { vegan: 1000, vegetarian: 1400, mixed: 2000, "meat-heavy": 2800 } as Record<Answers["diet"], number>,
  shopping: { low: 400, medium: 900, high: 1800 } as Record<Answers["shoppingPerMonth"], number>,
};

export const DEFAULT_ANSWERS: Answers = {
  carKmPerWeek: 0,
  busKmPerWeek: 0,
  flightsPerYear: 0,
  electricityKwhPerMonth: 120,
  lpgCylindersPerYear: 6,
  diet: "mixed",
  shoppingPerMonth: "medium",
};

const clamp = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculate(a: Answers): Result {
  const transport =
    clamp(a.carKmPerWeek) * 52 * FACTORS.carKm +
    clamp(a.busKmPerWeek) * 52 * FACTORS.busKm +
    clamp(a.flightsPerYear) * FACTORS.flight;
  const home =
    clamp(a.electricityKwhPerMonth) * 12 * FACTORS.electricityKwh +
    clamp(a.lpgCylindersPerYear) * FACTORS.lpgCylinder;
  const food = FACTORS.diet[a.diet];
  const shopping = FACTORS.shopping[a.shoppingPerMonth];
  const breakdown: Record<Category, number> = {
    Transport: transport,
    "Home energy": home,
    Food: food,
    Shopping: shopping,
  };
  const total = transport + home + food + shopping;
  return { total, breakdown };
}

export function topCategory(r: Result): Category {
  return (Object.entries(r.breakdown) as [Category, number][]).sort((x, y) => y[1] - x[1])[0][0];
}

export const TIPS: Record<Category, string[]> = {
  Transport: [
    "Swap one weekly car trip for a bus or metro ride.",
    "Combine errands into one trip to cut short drives.",
    "Take the train instead of a short flight where one exists.",
  ],
  "Home energy": [
    "Switch to LED bulbs and turn off standby devices.",
    "Set the AC two degrees higher; it lowers the bill and the footprint.",
    "Fix leaking taps and use a pressure cooker to save LPG.",
  ],
  Food: [
    "Try two vegetarian days a week.",
    "Plan meals to reduce food waste.",
    "Buy seasonal and local produce when you can.",
  ],
  Shopping: [
    "Repair or buy second-hand before buying new.",
    "Wait 48 hours before non-essential purchases.",
    "Choose fewer, longer-lasting items.",
  ],
};
