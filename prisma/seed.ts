import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

// A small specialty-coffee shop catalog. Five of twelve items sit at or below
// their reorder level (one fully out of stock) so the LOW STOCK / OUT badges
// are visible immediately, including the qty == reorderLevel boundary case.
const products = [
  { name: "Ethiopia Yirgacheffe (250g)", sku: "COF-ETH-250", category: "Coffee Beans", quantityInStock: 42, unitPriceCents: 1850, reorderLevel: 15 },
  { name: "Colombia Huila (250g)", sku: "COF-COL-250", category: "Coffee Beans", quantityInStock: 8, unitPriceCents: 1650, reorderLevel: 12 }, // LOW
  { name: "Sumatra Mandheling (1kg)", sku: "COF-SUM-1K", category: "Coffee Beans", quantityInStock: 0, unitPriceCents: 5400, reorderLevel: 6 }, // OUT
  { name: "Decaf House Blend (250g)", sku: "COF-DEC-250", category: "Coffee Beans", quantityInStock: 23, unitPriceCents: 1500, reorderLevel: 10 },
  { name: "Hario V60 02 Dripper", sku: "EQP-V60-02", category: "Brewing Equipment", quantityInStock: 14, unitPriceCents: 2400, reorderLevel: 8 },
  { name: "Fellow Stagg EKG Kettle", sku: "EQP-EKG-01", category: "Brewing Equipment", quantityInStock: 3, unitPriceCents: 16500, reorderLevel: 4 }, // LOW
  { name: "Comandante C40 Grinder", sku: "EQP-C40-01", category: "Brewing Equipment", quantityInStock: 5, unitPriceCents: 29900, reorderLevel: 5 }, // LOW (qty == reorder)
  { name: "AeroPress Original", sku: "EQP-AER-01", category: "Brewing Equipment", quantityInStock: 31, unitPriceCents: 3995, reorderLevel: 10 },
  { name: "Unbleached #2 Filters (100ct)", sku: "SUP-FLT-100", category: "Supplies", quantityInStock: 64, unitPriceCents: 850, reorderLevel: 20 },
  { name: "12oz Compostable Cups (50ct)", sku: "SUP-CUP-12", category: "Supplies", quantityInStock: 12, unitPriceCents: 1200, reorderLevel: 25 }, // LOW
  { name: "Cleaning Tablets (90ct)", sku: "SUP-CLN-90", category: "Supplies", quantityInStock: 47, unitPriceCents: 1995, reorderLevel: 15 },
  { name: "Ceramic Pour-Over Mug", sku: "MER-MUG-01", category: "Merchandise", quantityInStock: 26, unitPriceCents: 1800, reorderLevel: 12 },
];

async function main() {
  // Idempotent: clear then re-create so re-running the seed never trips the unique SKU constraint.
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });

  // One demo user. Upsert so re-seeding keeps the login working (admin / admin123).
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash: hashPassword("admin123") },
    create: { username: "admin", passwordHash: hashPassword("admin123") },
  });

  const count = await prisma.product.count();
  const low = products.filter((p) => p.quantityInStock <= p.reorderLevel).length;
  console.log(
    `Seeded ${count} products (${low} at or below reorder level) and 1 user (admin).`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
