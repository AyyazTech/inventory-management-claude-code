import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/current-user";
import { Shell } from "./_components/Shell";

// Shared dashboard shell. A route group so the URL stays /products (no
// /dashboard segment); future sections drop in beside products/ and inherit
// the sidebar for free. Middleware guarantees a session before this renders.
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return <Shell username={user ?? ""}>{children}</Shell>;
}
