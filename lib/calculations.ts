export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very";

export const ACTIVITY_OPTIONS: {
  value: ActivityLevel;
  label: string;
  multiplier: number;
}[] = [
  {
    value: "sedentary",
    label: "Sedentary (little or no exercise)",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Lightly active (1–3 days/week)",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Moderately active (3–5 days/week)",
    multiplier: 1.55,
  },
  {
    value: "active",
    label: "Very active (6–7 days/week)",
    multiplier: 1.725,
  },
  {
    value: "very",
    label: "Extra active (physical job / twice daily)",
    multiplier: 1.9,
  },
];

/** Mifflin-St Jeor: weight in kg, height in cm, age in years. */
export function calculateBmr({
  age,
  gender,
  weightKg,
  heightCm,
}: {
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
}): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTdee(bmr: number, activity: ActivityLevel): number {
  const option = ACTIVITY_OPTIONS.find((item) => item.value === activity);
  return bmr * (option?.multiplier ?? 1.2);
}

const KCAL_PER_KG = 7700;

export function calculateGoalPlan({
  currentKg,
  goalKg,
  weeks,
  tdee,
}: {
  currentKg: number;
  goalKg: number;
  weeks: number;
  tdee: number | null;
}) {
  const deltaKg = goalKg - currentKg;
  const weeklyChangeKg = deltaKg / weeks;
  const dailyKcalAdjustment = (weeklyChangeKg * KCAL_PER_KG) / 7;
  const isLoss = deltaKg < 0;
  const dailyCalories =
    tdee == null ? null : Math.round(tdee + dailyKcalAdjustment);

  return {
    isLoss,
    weeklyChangeKg,
    estimatedWeeklyChangeKg: Math.abs(weeklyChangeKg),
    dailyKcalAdjustment,
    dailyCalories,
    isAggressive: Math.abs(weeklyChangeKg) > 1,
    isBelowFloor: dailyCalories != null && dailyCalories < 1200,
  };
}

export function formatKcal(value: number): string {
  return `${Math.round(value).toLocaleString()} kcal`;
}

export function formatKg(value: number, digits = 1): string {
  return `${value.toFixed(digits)} kg`;
}
