import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { Topbar } from "./_components/Topbar";
import { StatCard } from "./_components/StatCard";
import { CategoryBarChart } from "./_components/CategoryBarChart";

// Live inventory snapshot — always computed from current data.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const products = await prisma.product.findMany();

  const totalProducts = products.length;
  const totalValueCents = products.reduce(
    (sum, p) => sum + p.quantityInStock * p.unitPriceCents,
    0,
  );
  const lowCount = products.filter(
    (p) => p.quantityInStock <= p.reorderLevel,
  ).length;

  // Total stock quantity per category, largest first.
  const byCategory = new Map<string, number>();
  for (const p of products) {
    byCategory.set(
      p.category,
      (byCategory.get(p.category) ?? 0) + p.quantityInStock,
    );
  }
  const categoryData = [...byCategory.entries()]
    .map(([category, quantity]) => ({ category, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Inventory at a glance" />
      <div className="flex flex-col gap-5 px-4 py-5 lg:gap-6 lg:px-8 lg:py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total products" value={String(totalProducts)} />
          <StatCard label="Total stock value" value={formatMoney(totalValueCents)} />
          <StatCard
            label="Low on stock"
            value={String(lowCount)}
            tone={lowCount > 0 ? "warn" : "default"}
            hint={
              lowCount > 0 ? "at or below reorder level" : "everything healthy"
            }
          />
        </div>
        <CategoryBarChart data={categoryData} />
      </div>
    </>
  );
}
