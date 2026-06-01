"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

export function Shell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Backdrop — mobile only, when the drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: off-canvas drawer on mobile, sticky column on desktop */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out",
          "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar username={username} onClose={() => setOpen(false)} />
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (hidden on desktop, where the sidebar is visible) */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-md text-ink transition-colors hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded bg-accent text-on-accent">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2 22 12 12 22 2 12Z" />
              </svg>
            </span>
            <span className="font-serif text-base font-semibold tracking-tight text-ink">
              Ledger
            </span>
          </Link>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
