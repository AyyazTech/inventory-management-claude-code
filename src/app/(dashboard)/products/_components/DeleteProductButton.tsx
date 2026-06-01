"use client";

import { useActionState, useEffect, useRef } from "react";
import { deleteProduct } from "../actions";
import type { ProductFormState } from "@/types/product";
import { SubmitButton } from "./SubmitButton";

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    deleteProduct,
    { ok: false },
  );

  useEffect(() => {
    if (state.ok) ref.current?.close();
  }, [state]);

  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`Delete ${name}`}
        className="grid h-8 w-8 place-items-center rounded-md text-faint transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
      >
        <TrashIcon />
      </button>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-line bg-raised p-0 text-ink shadow-pop"
      >
        <div className="p-6">
          <h2 className="font-serif text-lg font-semibold tracking-tight text-ink">
            Delete product?
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            <span className="font-medium text-ink">{name}</span> will be
            permanently removed. This can&rsquo;t be undone.
          </p>

          {state.message && !state.ok && (
            <p role="alert" className="mt-3 text-sm text-out">
              {state.message}
            </p>
          )}

          <form action={formAction} className="mt-5 flex items-center justify-end gap-2.5">
            <input type="hidden" name="id" value={id} />
            <button
              type="button"
              onClick={close}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-sunken hover:text-ink"
            >
              Cancel
            </button>
            <SubmitButton variant="danger" pendingLabel="Deleting…">
              Delete
            </SubmitButton>
          </form>
        </div>
      </dialog>
    </>
  );
}
