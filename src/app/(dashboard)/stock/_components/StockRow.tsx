import type { Product } from "@prisma/client";
import { StockBadge } from "@/components/StockBadge";
import { StockAdjuster } from "./StockAdjuster";

export function StockRow({ product }: { product: Product }) {
  return (
    <tr className="border-t border-line transition-colors hover:bg-sunken/60">
      <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted">{product.sku}</td>
      <td className="px-4 py-3 text-right font-mono text-base font-semibold tabular-nums text-ink">
        {product.quantityInStock}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-muted">
        {product.reorderLevel}
      </td>
      <td className="px-4 py-3">
        <StockBadge
          quantity={product.quantityInStock}
          reorderLevel={product.reorderLevel}
        />
      </td>
      <td className="px-4 py-3">
        <StockAdjuster
          productId={product.id}
          quantity={product.quantityInStock}
        />
      </td>
    </tr>
  );
}
