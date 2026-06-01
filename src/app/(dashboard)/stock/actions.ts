"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { StockFormState } from "@/types/stock";

const MAX_AMOUNT = 1_000_000;

const AdjustSchema = z.object({
  productId: z.coerce.number().int().positive(),
  amount: z.coerce
    .number()
    .int("Whole numbers only")
    .min(1, "Enter an amount above 0")
    .max(MAX_AMOUNT, `Keep it under ${MAX_AMOUNT.toLocaleString("en-US")}`),
  type: z.enum(["IN", "OUT"]),
});

// Thrown inside the transaction to abort with a user-facing form state.
class StockAdjustError extends Error {
  readonly formState: StockFormState;
  constructor(formState: StockFormState) {
    super("stock-adjust");
    this.formState = formState;
  }
}

export async function adjustStock(
  _prev: StockFormState,
  formData: FormData,
): Promise<StockFormState> {
  const parsed = AdjustSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const amountIssue = parsed.error.issues.find((i) => i.path[0] === "amount");
    return amountIssue
      ? { ok: false, errors: { amount: [amountIssue.message] } }
      : { ok: false, message: "Could not process that stock change." };
  }

  const { productId, amount, type } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      if (type === "OUT") {
        // Conditional decrement: the WHERE clause guards against going below
        // zero atomically, so the check can't be defeated by a concurrent
        // adjustment racing between a read and the write.
        const res = await tx.product.updateMany({
          where: { id: productId, quantityInStock: { gte: amount } },
          data: { quantityInStock: { decrement: amount } },
        });
        if (res.count === 0) {
          const current = await tx.product.findUnique({
            where: { id: productId },
            select: { quantityInStock: true },
          });
          throw new StockAdjustError(
            current
              ? {
                  ok: false,
                  errors: {
                    amount: [
                      `Only ${current.quantityInStock} in stock — can't remove ${amount}`,
                    ],
                  },
                }
              : { ok: false, message: "That product no longer exists." },
          );
        }
      } else {
        const res = await tx.product.updateMany({
          where: { id: productId },
          data: { quantityInStock: { increment: amount } },
        });
        if (res.count === 0) {
          throw new StockAdjustError({
            ok: false,
            message: "That product no longer exists.",
          });
        }
      }

      // Read the post-update quantity inside the same transaction so the logged
      // resultingQuantity always matches the on-hand count.
      const updated = await tx.product.findUniqueOrThrow({
        where: { id: productId },
        select: { quantityInStock: true },
      });
      await tx.stockMovement.create({
        data: { productId, type, amount, resultingQuantity: updated.quantityInStock },
      });
    });
  } catch (e) {
    if (e instanceof StockAdjustError) return e.formState;
    throw e;
  }

  revalidatePath("/stock");
  revalidatePath("/movements");
  revalidatePath("/products");
  return { ok: true };
}
