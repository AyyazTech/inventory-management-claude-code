"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adjustStock } from "../actions";
import type { StockFormState } from "@/types/stock";

const initialState: StockFormState = { ok: false };

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DirectionButton({
  type,
  disabled,
}: {
  type: "IN" | "OUT";
  disabled?: boolean;
}) {
  const { pending, data } = useFormStatus();
  const active = pending && data?.get("type") === type;
  const isIn = type === "IN";

  return (
    <button
      type="submit"
      name="type"
      value={type}
      disabled={pending || disabled}
      aria-label={isIn ? "Stock in" : "Stock out"}
      className={[
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        isIn
          ? "border-accent/30 bg-accent-soft text-accent hover:bg-accent hover:text-on-accent"
          : "border-line bg-surface text-muted hover:bg-sunken hover:text-ink",
      ].join(" ")}
    >
      {active ? (
        <Spinner />
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          {isIn ? <path d="M12 5v14M5 12h14" /> : <path d="M5 12h14" />}
        </svg>
      )}
      {isIn ? "In" : "Out"}
    </button>
  );
}

export function StockAdjuster({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}) {
  const [state, formAction] = useActionState(adjustStock, initialState);
  const error = state.errors?.amount?.[0] ?? (!state.ok ? state.message : undefined);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <input type="hidden" name="productId" value={productId} />
        <input
          name="amount"
          type="number"
          min={1}
          max={1000000}
          step={1}
          defaultValue={1}
          aria-label="Amount to adjust"
          aria-invalid={error ? true : undefined}
          className="w-16 rounded-md border border-line bg-surface px-2 py-1.5 text-right font-mono text-sm tabular-nums text-ink outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-ring"
        />
        <DirectionButton type="OUT" disabled={quantity <= 0} />
        <DirectionButton type="IN" />
      </div>
      {error && (
        <p role="alert" className="text-xs text-out">
          {error}
        </p>
      )}
    </form>
  );
}
