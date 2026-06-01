import "server-only";
import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE } from "./session";

/** The signed-in username (verified from the session cookie), or null. */
export async function getCurrentUser(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return readSessionToken(token);
}
