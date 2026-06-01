import type { ReactNode } from "react";

type TopbarProps = {
  title: string;
  count?: number;
  subtitle?: string;
  action?: ReactNode;
};

/**
 * Sticky page header rendered at the top of a dashboard page's content.
 * Pages pass their own title/action so a primary CTA (e.g. a create dialog)
 * stays colocated with the page that owns it.
 */
export function Topbar({ title, count, subtitle, action }: TopbarProps) {
  return (
    <header className="z-10 border-b border-line bg-canvas/85 backdrop-blur-sm lg:sticky lg:top-0">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8 lg:py-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-serif text-2xl font-semibold leading-none tracking-tight text-ink">
              {title}
            </h1>
            {count !== undefined && (
              <span className="tabular rounded-full bg-sunken px-2 py-0.5 text-xs font-semibold text-muted">
                {count}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
