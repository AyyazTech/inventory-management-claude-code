import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Ledger",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-md bg-accent text-on-accent shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2 22 12 12 22 2 12Z" />
            </svg>
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Ledger
          </span>
        </div>

        <div className="rounded-lg border border-line bg-surface p-7 shadow-sm">
          <h1 className="font-serif text-xl font-semibold tracking-tight text-ink">
            Sign in
          </h1>
          <p className="mb-5 mt-1 text-sm text-muted">
            Enter your credentials to access the inventory.
          </p>
          <LoginForm />
        </div>

        <p className="mt-4 text-center font-mono text-xs text-faint">
          Demo · admin / admin123
        </p>
      </div>
    </div>
  );
}
