"use client";

import { useActionState, useEffect, useId } from "react";
import { CATEGORIES } from "@/lib/format";
import type { ProductFormState, ProductInput, ProductField } from "@/types/product";
import { SubmitButton } from "./SubmitButton";

const initialState: ProductFormState = { ok: false };

type ProductFormProps = {
  mode: "create" | "edit";
  product?: ProductInput;
  action: (prev: ProductFormState, data: FormData) => Promise<ProductFormState>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProductForm({
  mode,
  product,
  action,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onSuccess?.();
    // A fresh state object is returned on every submit, so this fires once per
    // successful action.
  }, [state, onSuccess]);

  const priceDefault =
    product !== undefined ? (product.unitPriceCents / 100).toFixed(2) : "";

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {mode === "edit" && product && (
        <input type="hidden" name="id" value={product.id} />
      )}

      <Field
        name="name"
        label="Product name"
        errors={state.errors}
        defaultValue={product?.name}
        placeholder="Ethiopia Yirgacheffe (250g)"
        autoFocus
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          name="sku"
          label="SKU"
          errors={state.errors}
          defaultValue={product?.sku}
          placeholder="COF-ETH-250"
          mono
        />
        <Field name="category" label="Category" errors={state.errors}>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? ""}
            aria-invalid={state.errors?.category ? true : undefined}
            className="w-full appearance-none rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            <option value="" disabled>
              Select a category…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          name="quantityInStock"
          label="In stock"
          errors={state.errors}
          defaultValue={product ? String(product.quantityInStock) : "0"}
          type="number"
          min={0}
          step={1}
          mono
        />
        <Field name="unitPrice" label="Unit price" errors={state.errors}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-faint">
              $
            </span>
            <input
              id="unitPrice"
              name="unitPrice"
              inputMode="decimal"
              defaultValue={priceDefault}
              placeholder="0.00"
              aria-invalid={state.errors?.unitPrice ? true : undefined}
              className="w-full rounded-md border border-line bg-surface py-2 pl-7 pr-3 font-mono text-sm tabular-nums text-ink outline-none placeholder:text-faint focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-ring"
            />
          </div>
        </Field>
        <Field
          name="reorderLevel"
          label="Reorder level"
          errors={state.errors}
          defaultValue={product ? String(product.reorderLevel) : "0"}
          type="number"
          min={0}
          step={1}
          mono
        />
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="text-sm text-out">
          {state.message}
        </p>
      )}

      <div className="mt-1 flex items-center justify-end gap-2.5 border-t border-line pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-sunken hover:text-ink"
        >
          Cancel
        </button>
        <SubmitButton pendingLabel={mode === "create" ? "Adding…" : "Saving…"}>
          {mode === "create" ? "Add product" : "Save changes"}
        </SubmitButton>
      </div>
    </form>
  );
}

type FieldProps = {
  name: ProductField;
  label: string;
  errors?: ProductFormState["errors"];
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  step?: number;
  mono?: boolean;
  autoFocus?: boolean;
  children?: React.ReactNode;
};

function Field({
  name,
  label,
  errors,
  defaultValue,
  placeholder,
  type = "text",
  min,
  step,
  mono,
  autoFocus,
  children,
}: FieldProps) {
  const fieldErrors = errors?.[name];
  const describedBy = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          type={type}
          min={min}
          step={step}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={fieldErrors ? true : undefined}
          aria-describedby={fieldErrors ? describedBy : undefined}
          className={`w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-ring ${
            mono ? "font-mono tabular-nums" : ""
          }`}
        />
      )}
      {fieldErrors && (
        <p id={describedBy} className="text-xs text-out" aria-live="polite">
          {fieldErrors[0]}
        </p>
      )}
    </div>
  );
}
