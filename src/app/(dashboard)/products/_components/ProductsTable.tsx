import type { Product } from "@prisma/client";
import { ProductRow } from "./ProductRow";
import { ProductDialog } from "./ProductDialog";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-sunken text-faint" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12" />
        </svg>
      </span>
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">No products yet</h2>
        <p className="mt-1 text-sm text-muted">
          Add your first catalog item to get started.
        </p>
      </div>
      <ProductDialog mode="create" />
    </div>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
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
              <th className={th}>Category</th>
              <th className={thRight}>In stock</th>
              <th className={thRight}>Unit price</th>
              <th className={thRight}>Reorder</th>
              <th className={th}>Status</th>
              <th className={thRight}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
