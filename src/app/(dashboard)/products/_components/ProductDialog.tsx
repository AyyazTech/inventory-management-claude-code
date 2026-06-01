"use client";

import { useRef, useState } from "react";
import { createProduct, updateProduct } from "../actions";
import { ProductForm } from "./ProductForm";
import type { ProductInput } from "@/types/product";

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ProductDialog({
  mode,
  product,
}: {
  mode: "create" | "edit";
  product?: ProductInput;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
    ref.current?.showModal();
  };
  // close() fires the dialog's native `close` event, which clears `open`.
  const close = () => ref.current?.close();

  return (
    <>
      {mode === "create" ? (
        <button
          type="button"
          onClick={show}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <PlusIcon />
          Add product
        </button>
      ) : (
        <button
          type="button"
          onClick={show}
          aria-label={`Edit ${product?.name ?? "product"}`}
          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Edit
        </button>
      )}

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="m-auto w-[min(36rem,calc(100vw-2rem))] max-h-[calc(100vh-4rem)] overflow-visible rounded-lg border border-line bg-raised p-0 text-ink shadow-pop"
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <header className="mb-5 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">
                {mode === "create" ? "Add product" : "Edit product"}
              </h2>
              <p className="text-sm text-muted">
                {mode === "create"
                  ? "Add a new item to the catalog."
                  : `Editing ${product?.sku ?? ""}`}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-1 -mt-1 grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CloseIcon />
            </button>
          </header>

          {open && (
            <ProductForm
              mode={mode}
              product={product}
              action={mode === "create" ? createProduct : updateProduct}
              onSuccess={close}
              onCancel={close}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
