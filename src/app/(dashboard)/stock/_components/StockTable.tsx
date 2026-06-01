import type { Product } from "@prisma/client";
import Link from "next/link";
import { StockRow } from "./StockRow";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
      <h2 className="font-serif text-lg font-semibold text-ink">
        Nothing to adjust yet
      </h2>
      <p className="max-w-sm text-sm text-muted">
        Add products to your catalog and you can stock them in and out from
        here.
      </p>
      <Link
        href="/products"
        className="rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover"
      >
        Go to Products
      </Link>
    </div>
  );
}

export function StockTable({ products }: { products: Product[] }) {
  if (products.length === 0) return <EmptyState />;

  const th = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-muted";
  const thRight = `${th} text-right`;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sunken">
              <th className={th}>Product</th>
              <th className={th}>SKU</th>
              <th className={thRight}>In stock</th>
              <th className={thRight}>Reorder</th>
              <th className={th}>Status</th>
              <th className={thRight}>Adjust stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <StockRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
