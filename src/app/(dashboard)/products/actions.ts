"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, dollarsToCents } from "@/lib/format";
import type { ProductFormState } from "@/types/product";

const ProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Keep it under 120 characters"),
  sku: z.string().trim().min(1, "SKU is required").max(40, "Keep it under 40 characters"),
  category: z.enum(CATEGORIES),
  quantityInStock: z.coerce.number().int("Whole numbers only").min(0, "Cannot be negative"),
  unitPrice: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine(
      (v) => /^\$?\d+(\.\d{1,2})?$/.test(v.replace(/,/g, "")),
      "Enter a valid price, e.g. 18.50",
    ),
  reorderLevel: z.coerce.number().int("Whole numbers only").min(0, "Cannot be negative"),
});

// Build a field -> messages map straight from issues. Avoids relying on zod's
// `.flatten()` (whose API shifted between major versions).
function fieldErrorsFrom(error: z.ZodError): ProductFormState["errors"] {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (!key) continue;
    (errors[key] ??= []).push(issue.message);
  }
  return errors as ProductFormState["errors"];
}

function isUniqueSkuError(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

function readId(formData: FormData): number | null {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: fieldErrorsFrom(parsed.error),
    };
  }

  const { unitPrice, ...rest } = parsed.data;
  try {
    await prisma.product.create({
      data: { ...rest, unitPriceCents: dollarsToCents(unitPrice) },
    });
  } catch (e) {
    if (isUniqueSkuError(e)) {
      return { ok: false, errors: { sku: ["That SKU is already in use"] } };
    }
    throw e;
  }

  revalidatePath("/products");
  return { ok: true, message: "Product added." };
}

export async function updateProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const id = readId(formData);
  if (id === null) {
    return { ok: false, message: "Could not determine which product to update." };
  }

  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: fieldErrorsFrom(parsed.error),
    };
  }

  const { unitPrice, ...rest } = parsed.data;
  try {
    await prisma.product.update({
      where: { id },
      data: { ...rest, unitPriceCents: dollarsToCents(unitPrice) },
    });
  } catch (e) {
    if (isUniqueSkuError(e)) {
      return { ok: false, errors: { sku: ["That SKU is already in use"] } };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, message: "That product no longer exists." };
    }
    throw e;
  }

  revalidatePath("/products");
  return { ok: true, message: "Changes saved." };
}

export async function deleteProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const id = readId(formData);
  if (id === null) {
    return { ok: false, message: "Could not determine which product to delete." };
  }

  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    // Already gone — treat as a successful delete so the UI settles.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      revalidatePath("/products");
      return { ok: true };
    }
    throw e;
  }

  revalidatePath("/products");
  return { ok: true, message: "Product deleted." };
}
