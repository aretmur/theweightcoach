export function Footer() {
  return (
    <footer className="border-t border-card-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} The Weight Coach</p>
        <p className="max-w-xl sm:text-right">
          Estimates only — not medical advice. Speak with a qualified clinician
          before making significant diet or training changes.
        </p>
      </div>
    </footer>
  );
}
