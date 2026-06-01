import { prisma } from "@/lib/prisma";
import { Topbar } from "../_components/Topbar";
import { MovementsTable } from "./_components/MovementsTable";

// The log must reflect every change as it happens.
export const dynamic = "force-dynamic";

export default async function MovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const subtitle =
    movements.length === 0
      ? "No changes recorded yet"
      : `${movements.length} change${movements.length === 1 ? "" : "s"} recorded`;

  return (
    <>
      <Topbar title="Movements" count={movements.length} subtitle={subtitle} />
      <div className="px-4 py-5 lg:px-8 lg:py-6">
        <MovementsTable movements={movements} />
      </div>
    </>
  );
}
