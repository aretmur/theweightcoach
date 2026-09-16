"use client";

import { FormEvent, useState } from "react";
import { calculateGoalPlan, formatKcal, formatKg } from "@/lib/calculations";
import { PrimaryButton, TextField } from "@/components/FormFields";

type Props = {
  tdee: number | null;
  onCalculated: () => void;
};

export function CalorieGoalCalculator({ tdee, onCalculated }: Props) {
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [weeks, setWeeks] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateGoalPlan> | null>(
    null,
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentKg = Number(currentWeight);
    const goalKg = Number(goalWeight);
    const timeframe = Number(weeks);

    if (
      !Number.isFinite(currentKg) ||
      currentKg < 30 ||
      currentKg > 300 ||
      !Number.isFinite(goalKg) ||
      goalKg < 30 ||
      goalKg > 300 ||
      !Number.isFinite(timeframe) ||
      timeframe < 1 ||
      timeframe > 104
    ) {
      setError("Enter realistic weights and a timeframe between 1 and 104 weeks.");
      setResult(null);
      return;
    }

    if (currentKg === goalKg) {
      setError("Goal weight should be different from current weight.");
      setResult(null);
      return;
    }

    setError("");
    setResult(
      calculateGoalPlan({
        currentKg,
        goalKg,
        weeks: timeframe,
        tdee,
      }),
    );
    onCalculated();
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.55)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Tool 02
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">
        Calorie Deficit / Goal
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Translate a target weight and timeline into a daily calorie plan and
        estimated weekly change.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-1 flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Current weight"
            type="number"
            inputMode="decimal"
            min={30}
            max={300}
            step="0.1"
            value={currentWeight}
            onChange={(event) => setCurrentWeight(event.target.value)}
            placeholder="82.5"
            required
          />
          <TextField
            label="Goal weight"
            type="number"
            inputMode="decimal"
            min={30}
            max={300}
            step="0.1"
            value={goalWeight}
            onChange={(event) => setGoalWeight(event.target.value)}
            placeholder="76"
            required
          />
        </div>
        <TextField
          label="Timeframe (weeks)"
          type="number"
          inputMode="numeric"
          min={1}
          max={104}
          value={weeks}
          onChange={(event) => setWeeks(event.target.value)}
          placeholder="12"
          required
        />

        <p className="text-xs leading-relaxed text-muted">
          {tdee
            ? `Using your calculated TDEE of ${formatKcal(tdee)} as maintenance.`
            : "Calculate TDEE first to unlock a daily calorie target. Weekly change still works without it."}
        </p>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="mt-auto pt-2">
          <PrimaryButton>Calculate goal</PrimaryButton>
        </div>
      </form>

      {result ? (
        <div
          className="mt-5 space-y-3 rounded-xl border border-card-border bg-background/50 p-4"
          aria-live="polite"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Daily calories
              </p>
              <p className="mt-1 font-semibold tabular-nums text-accent">
                {result.dailyCalories == null
                  ? "TDEE needed"
                  : formatKcal(result.dailyCalories)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Weekly {result.isLoss ? "loss" : "gain"}
              </p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatKg(result.estimatedWeeklyChangeKg)}
              </p>
            </div>
          </div>
          {result.isAggressive ? (
            <p className="text-xs leading-relaxed text-amber-300">
              This pace is aggressive (over 1 kg per week). A slower timeline is
              usually more sustainable.
            </p>
          ) : null}
          {result.isBelowFloor ? (
            <p className="text-xs leading-relaxed text-amber-300">
              This target falls below 1,200 kcal. Consider a longer timeframe
              before going that low.
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
