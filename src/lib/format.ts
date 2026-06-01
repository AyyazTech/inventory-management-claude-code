// Allowed product categories. SQLite has no native enum, so this const is the
// single source of truth — it populates the form's category <select> and backs
// the zod `z.enum(CATEGORIES)` validation in the server actions.
export const CATEGORIES = [
  "Coffee Beans",
  "Brewing Equipment",
  "Supplies",
  "Merchandise",
] as const;

export type Category = (typeof CATEGORIES)[number];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format integer cents as a localized currency string, e.g. 1850 -> "$18.50". */
export function formatMoney(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Format a timestamp as e.g. "Jun 1, 2026, 3:30 PM". */
export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

/** Parse a dollars string from a form ("12.50", "$12.50") into integer cents. */
export function dollarsToCents(input: string): number {
  const n = Number(String(input).replace(/[^0-9.]/g, ""));
  return Math.round(n * 100);
}

export type StockStatus = "ok" | "low" | "out";

/**
 * Derive a product's stock status from its quantity and reorder level.
 * A product is LOW when at or below its reorder level (the `<=` boundary),
 * and OUT once it hits zero.
 */
export function stockStatus(
  quantity: number,
  reorderLevel: number,
): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= reorderLevel) return "low";
  return "ok";
}
