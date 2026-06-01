import type { Prisma } from "@prisma/client";
import { formatDateTime } from "@/lib/format";

export type MovementWithProduct = Prisma.StockMovementGetPayload<{
  include: { product: true };
}>;

function MovementTag({ type }: { type: string }) {
  const isIn = type === "IN";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isIn ? "bg-ok-soft text-ok" : "bg-low-soft text-low"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isIn ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
      </svg>
      {isIn ? "Stock in" : "Stock out"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
      <h2 className="font-serif text-lg font-semibold text-ink">
        No movements yet
      </h2>
      <p className="max-w-sm text-sm text-muted">
        Stock in or out from the Stock page and every change will appear here.
      </p>
    </div>
  );
}

export function MovementsTable({
  movements,
}: {
  movements: MovementWithProduct[];
}) {
  if (movements.length === 0) return <EmptyState />;

  const th = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-muted";
  const thRight = `${th} text-right`;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sunken">
              <th className={th}>Product</th>
              <th className={th}>Movement</th>
              <th className={thRight}>Change</th>
              <th className={thRight}>Resulting stock</th>
              <th className={thRight}>When</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => {
              const isIn = m.type === "IN";
              return (
                <tr key={m.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{m.product.name}</div>
                    <div className="font-mono text-xs text-muted">
                      {m.product.sku}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <MovementTag type={m.type} />
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-semibold tabular-nums ${
                      isIn ? "text-ok" : "text-low"
                    }`}
                  >
                    {isIn ? "+" : "−"}
                    {m.amount}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                    {m.resultingQuantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted">
                    {formatDateTime(m.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
