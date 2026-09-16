"use client";

import { FormEvent, useState } from "react";
import {
  loadWeightEntries,
  saveWeightEntries,
  type WeightEntry,
} from "@/lib/storage";
import { PrimaryButton, TextField } from "@/components/FormFields";

function todayIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function formatDisplayDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function WeightTracker() {
  const [date, setDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return todayIsoDate();
  });
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    if (typeof window === "undefined") return [];
    return loadWeightEntries();
  });

  function persist(next: WeightEntry[]) {
    const trimmed = next
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 14);
    setEntries(trimmed);
    saveWeightEntries(trimmed);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedWeight = Number(weight);
    if (!date || !Number.isFinite(parsedWeight) || parsedWeight < 20 || parsedWeight > 400) {
      setError("Add a date and a realistic weight in kilograms.");
      return;
    }

    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date,
      weight: parsedWeight,
      notes: notes.trim(),
    };

    persist([entry, ...entries.filter((item) => item.date !== date)]);
    setWeight("");
    setNotes("");
    setError("");
  }

  function removeEntry(id: string) {
    persist(entries.filter((entry) => entry.id !== id));
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.55)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Tool 03
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">Daily Weight Tracker</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Log weigh-ins privately on this device. The last 14 entries stay in your
        browser.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            suppressHydrationWarning
          />
          <TextField
            label="Weight (kg)"
            type="number"
            inputMode="decimal"
            min={20}
            max={400}
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="81.4"
            required
          />
        </div>
        <TextField
          label="Notes (optional)"
          type="text"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Sleep, travel, cycle..."
          maxLength={120}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <PrimaryButton>Save entry</PrimaryButton>
      </form>

      <div className="mt-5 min-h-0 flex-1" suppressHydrationWarning>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Recent entries
        </p>
        {entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-card-border px-3 py-4 text-sm text-muted">
            No entries yet. Log today&apos;s weight to start your trend.
          </p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-card-border bg-background/40 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium tabular-nums">
                    {entry.weight.toFixed(1)} kg
                    <span className="ml-2 font-normal text-muted">
                      {formatDisplayDate(entry.date)}
                    </span>
                  </p>
                  {entry.notes ? (
                    <p className="mt-0.5 text-xs text-muted">{entry.notes}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted transition hover:bg-red-500/10 hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
