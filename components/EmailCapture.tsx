"use client";

import { FormEvent, useState } from "react";
import { loadLeadEmails, saveLeadEmail } from "@/lib/storage";
import { PrimaryButton, TextField } from "@/components/FormFields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  visible: boolean;
};

export function EmailCapture({ visible }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    return loadLeadEmails().length > 0;
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    saveLeadEmail(value);
    setSubmitted(true);
    setError("");
    setEmail("");
  }

  if (!visible) return null;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-accent/20 bg-accent-soft px-5 py-6 sm:px-8 sm:py-8">
      {submitted ? (
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">You&apos;re on the list.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We&apos;ll send your free 7-Day Kickstart Plan soon. You can keep using
            the tools in the meantime.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            Get your free 7-Day Kickstart Plan
          </h3>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted">
            A simple week of structure — calories, protein, and daily weigh-in
            habits — delivered to your inbox.
          </p>
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-5 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <PrimaryButton className="sm:w-auto sm:px-5">Send the plan</PrimaryButton>
          </form>
          {error ? (
            <p className="mt-2 text-center text-sm text-red-400">{error}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
