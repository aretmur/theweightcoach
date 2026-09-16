"use client";

import { useState } from "react";
import { CalorieGoalCalculator } from "@/components/CalorieGoalCalculator";
import { EmailCapture } from "@/components/EmailCapture";
import { TdeeCalculator } from "@/components/TdeeCalculator";
import { WeightTracker } from "@/components/WeightTracker";

export function ToolsSection() {
  const [tdee, setTdee] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  return (
    <section id="tools" className="scroll-mt-24 px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Main tools
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three numbers that keep a cut honest.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Everything runs locally. Nothing is sent to a server unless you
            choose to request the kickstart plan.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <TdeeCalculator
            onCalculated={(value) => {
              setTdee(value);
              setHasCalculated(true);
            }}
          />
          <CalorieGoalCalculator
            tdee={tdee}
            onCalculated={() => setHasCalculated(true)}
          />
          <WeightTracker />
        </div>

        <EmailCapture visible={hasCalculated} />
      </div>
    </section>
  );
}
