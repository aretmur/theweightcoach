export const STORAGE_KEYS = {
  theme: "theme",
  weightEntries: "twc-weight-entries",
  leadEmails: "twc-lead-emails",
} as const;

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
  notes: string;
};

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadWeightEntries(): WeightEntry[] {
  const entries = readJson<WeightEntry[]>(STORAGE_KEYS.weightEntries, []);
  return entries
    .filter(
      (entry) =>
        typeof entry?.id === "string" &&
        typeof entry?.date === "string" &&
        typeof entry?.weight === "number",
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function saveWeightEntries(entries: WeightEntry[]) {
  writeJson(STORAGE_KEYS.weightEntries, entries.slice(0, 14));
}

export function loadLeadEmails(): string[] {
  return readJson<string[]>(STORAGE_KEYS.leadEmails, []).filter(
    (email) => typeof email === "string",
  );
}

export function saveLeadEmail(email: string) {
  const existing = loadLeadEmails();
  if (!existing.includes(email)) {
    existing.push(email);
    writeJson(STORAGE_KEYS.leadEmails, existing);
  }
}
