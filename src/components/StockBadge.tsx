import { stockStatus } from "@/lib/format";

const CONFIG = {
  ok: { label: "In stock", text: "text-ok", bg: "bg-ok-soft", dot: "bg-ok" },
  low: { label: "LOW STOCK", text: "text-low", bg: "bg-low-soft", dot: "bg-low" },
  out: { label: "OUT OF STOCK", text: "text-out", bg: "bg-out-soft", dot: "bg-out" },
} as const;

/**
 * Derived purely from quantity vs. reorder level. A product at or below its
 * reorder level shows the LOW STOCK badge (the OUT OF STOCK variant is the
 * stronger case once quantity hits zero).
 */
export function StockBadge({
  quantity,
  reorderLevel,
}: {
  quantity: number;
  reorderLevel: number;
}) {
  const status = stockStatus(quantity, reorderLevel);
  const { label, text, bg, dot } = CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${text} ${bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
