export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-serif text-3xl font-semibold tabular-nums tracking-tight ${
          tone === "warn" ? "text-low" : "text-ink"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}
