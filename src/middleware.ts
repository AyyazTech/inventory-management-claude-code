import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const user = await readSessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Unauthenticated → only the login page is reachable.
  if (!user && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already signed in → skip the login page.
  if (user && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
