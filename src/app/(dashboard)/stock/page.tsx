import { prisma } from "@/lib/prisma";
import { Topbar } from "../_components/Topbar";
import { StockTable } from "./_components/StockTable";

// Live on-hand quantities — never serve a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function StockPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  const lowCount = products.filter(
    (p) => p.quantityInStock <= p.reorderLevel,
  ).length;

  const subtitle =
    products.length === 0
      ? "No products to manage yet"
      : lowCount > 0
        ? `${lowCount} item${lowCount === 1 ? "" : "s"} need restocking`
        : "Everything is well stocked";

  return (
    <>
      <Topbar title="Stock" count={products.length} subtitle={subtitle} />
      <div className="px-4 py-5 lg:px-8 lg:py-6">
        <StockTable products={products} />
      </div>
    </>
  );
}
