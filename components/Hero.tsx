export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent-soft),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Private coaching tools
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
          Sustainable weight loss starts with the right numbers.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Calculate your TDEE, set a realistic calorie target, and track daily
          weight — privately in your browser, with no account required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="#tools"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(79,70,229,0.85)] transition hover:bg-accent-hover"
          >
            Open the tools
          </a>
          <p className="text-xs text-muted">Free · Private · Runs on your device</p>
        </div>
      </div>
    </section>
  );
}
