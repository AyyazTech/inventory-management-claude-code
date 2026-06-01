"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/login/actions";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  soon?: boolean;
};

const iconProps = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/products",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="m3.27 6.96 8.73 5.04 8.73-5.04" />
        <path d="M12 22.08V12" />
      </svg>
    ),
  },
  {
    label: "Stock",
    href: "/stock",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M7 7h11l-3-3" />
        <path d="M17 17H6l3 3" />
      </svg>
    ),
  },
  {
    label: "Movements",
    href: "/movements",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <line x1="8" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="8" y1="18" x2="20" y2="18" />
        <circle cx="4" cy="6" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="18" r="1" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "#",
    soon: true,
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <line x1="4" y1="7" x2="20" y2="7" />
        <circle cx="9" cy="7" r="2.4" fill="var(--surface)" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <circle cx="15" cy="17" r="2.4" fill="var(--surface)" />
      </svg>
    ),
  },
];

export function Sidebar({
  username,
  onClose,
}: {
  username: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const initial = (username.trim()[0] ?? "?").toUpperCase();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 pb-6 pt-7">
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-md bg-accent text-on-accent shadow-sm"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2 22 12 12 22 2 12Z" />
          </svg>
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            Ledger
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Inventory
          </span>
        </span>
        {/* Close (mobile drawer only) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
          Manage
        </p>
        {NAV.map((item) => {
          const active =
            !item.soon &&
            (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

          if (item.soon) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                title="Coming soon"
                className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-faint select-none"
              >
                <span className="text-faint">{item.icon}</span>
                {item.label}
                <span className="ml-auto rounded bg-sunken px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-faint">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-sunken hover:text-ink",
              ].join(" ")}
            >
              <span className={active ? "text-accent" : "text-faint"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Account */}
      <div className="mt-auto flex flex-col gap-1 border-t border-line px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
            {initial}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-ink">
              {username || "Signed in"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              Signed in
            </span>
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg {...iconProps} aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
