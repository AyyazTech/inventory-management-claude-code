import { prisma } from "@/lib/prisma";
import { Topbar } from "../_components/Topbar";
import { ProductsTable } from "./_components/ProductsTable";
import { ProductDialog } from "./_components/ProductDialog";

// Inventory is live data — always read current stock at request time rather
// than serving a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const lowCount = products.filter(
    (p) => p.quantityInStock <= p.reorderLevel,
  ).length;

  const subtitle =
    products.length === 0
      ? "Your catalog is empty"
      : lowCount > 0
        ? `${lowCount} item${lowCount === 1 ? "" : "s"} at or below reorder level`
        : "Everything is well stocked";

  return (
    <>
      <Topbar
        title="Products"
        count={products.length}
        subtitle={subtitle}
        action={<ProductDialog mode="create" />}
      />
      <div className="px-4 py-5 lg:px-8 lg:py-6">
        <ProductsTable products={products} />
      </div>
    </>
  );
}
