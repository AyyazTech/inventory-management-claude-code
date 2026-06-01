// Form fields that can carry a validation error. Mirrors the inputs in
// ProductForm and the zod schema in the products server actions.
export type ProductField =
  | "name"
  | "sku"
  | "category"
  | "quantityInStock"
  | "unitPrice"
  | "reorderLevel";

// Return shape of the create/update/delete server actions, also used as the
// initial state for `useActionState` in the client form.
export type ProductFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<ProductField, string[]>>;
};

// The serializable subset of a product handed to client components (form,
// dialog). Excludes timestamps the editor doesn't need.
export type ProductInput = {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantityInStock: number;
  unitPriceCents: number;
  reorderLevel: number;
};
