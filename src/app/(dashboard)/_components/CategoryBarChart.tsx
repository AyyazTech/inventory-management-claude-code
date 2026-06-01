export function CategoryBarChart({
  data,
}: {
  data: { category: string; quantity: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.quantity));
  const totalUnits = data.reduce((s, d) => s + d.quantity, 0);

  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-lg font-semibold tracking-tight text-ink">
          Stock by category
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted">
          {totalUnits} units total
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted">No products yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((d) => {
            const pct = (d.quantity / max) * 100;
            return (
              <div
                key={d.category}
                className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[9rem_1fr_3rem]"
                aria-label={`${d.category}: ${d.quantity} units`}
              >
                <span className="truncate text-sm text-ink">{d.category}</span>
                <div className="h-7 overflow-hidden rounded bg-sunken">
                  <div
                    className="h-full rounded bg-accent"
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-right font-mono text-sm font-semibold tabular-nums text-ink">
                  {d.quantity}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
