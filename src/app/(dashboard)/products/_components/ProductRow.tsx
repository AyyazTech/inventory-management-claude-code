import type { Product } from "@prisma/client";
import { formatMoney } from "@/lib/format";
import type { ProductInput } from "@/types/product";
import { StockBadge } from "@/components/StockBadge";
import { ProductDialog } from "./ProductDialog";
import { DeleteProductButton } from "./DeleteProductButton";

export function ProductRow({ product }: { product: Product }) {
  const input: ProductInput = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    quantityInStock: product.quantityInStock,
    unitPriceCents: product.unitPriceCents,
    reorderLevel: product.reorderLevel,
  };

  return (
    <tr className="group border-t border-line transition-colors hover:bg-sunken/60">
      <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted">{product.sku}</td>
      <td className="px-4 py-3 text-sm text-muted">{product.category}</td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
        {product.quantityInStock}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
        {formatMoney(product.unitPriceCents)}
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
        <div className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <ProductDialog mode="edit" product={input} />
          <DeleteProductButton id={product.id} name={product.name} />
        </div>
      </td>
    </tr>
  );
}
