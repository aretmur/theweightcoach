"use client";

import { FormEvent, useState } from "react";
import {
  ACTIVITY_OPTIONS,
  calculateBmr,
  calculateTdee,
  formatKcal,
  type ActivityLevel,
  type Gender,
} from "@/lib/calculations";
import { PrimaryButton, SelectField, TextField } from "@/components/FormFields";

type Props = {
  onCalculated: (tdee: number) => void;
};

export function TdeeCalculator({ onCalculated }: Props) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAge = Number(age);
    const parsedWeight = Number(weight);
    const parsedHeight = Number(height);

    if (
      !Number.isFinite(parsedAge) ||
      parsedAge < 15 ||
      parsedAge > 100 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 30 ||
      parsedWeight > 300 ||
      !Number.isFinite(parsedHeight) ||
      parsedHeight < 100 ||
      parsedHeight > 250
    ) {
      setError("Enter a realistic age, weight (kg), and height (cm).");
      setResult(null);
      return;
    }

    const bmr = calculateBmr({
      age: parsedAge,
      gender,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
    });
    const tdee = calculateTdee(bmr, activity);

    setError("");
    setResult({ bmr, tdee });
    onCalculated(tdee);
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.55)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Tool 01
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">TDEE Calculator</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Estimate your basal metabolic rate and daily energy needs using the
        Mifflin-St Jeor equation.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-1 flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Age"
            type="number"
            inputMode="numeric"
            min={15}
            max={100}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="32"
            required
          />
          <SelectField
            label="Gender"
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Weight (kg)"
            type="number"
            inputMode="decimal"
            min={30}
            max={300}
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="82.5"
            required
          />
          <TextField
            label="Height (cm)"
            type="number"
            inputMode="decimal"
            min={100}
            max={250}
            step="0.1"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="178"
            required
          />
        </div>
        <SelectField
          label="Activity level"
          value={activity}
          onChange={(event) => setActivity(event.target.value as ActivityLevel)}
        >
          {ACTIVITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="mt-auto pt-2">
          <PrimaryButton>Calculate TDEE</PrimaryButton>
        </div>
      </form>

      {result ? (
        <div
          className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-card-border bg-background/50 p-4"
          aria-live="polite"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">BMR</p>
            <p className="mt-1 font-semibold tabular-nums">{formatKcal(result.bmr)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">TDEE</p>
            <p className="mt-1 font-semibold tabular-nums text-accent">
              {formatKcal(result.tdee)}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
