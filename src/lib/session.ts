// Edge-safe session helpers — Web Crypto only (no Node APIs), so this module
// can be imported by middleware. A session cookie is `username.HMAC(username)`;
// forgery is prevented by the signature, expiry by the cookie's maxAge.

export const SESSION_COOKIE = "ledger_session";

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";
}

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64url(new Uint8Array(sig));
}

export async function createSessionToken(username: string): Promise<string> {
  return `${username}.${await hmac(username)}`;
}

/** Returns the username if the token's signature is valid, otherwise null. */
export async function readSessionToken(
  token: string | undefined,
): Promise<string | null> {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const username = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  const expected = await hmac(username);

  // Constant-time-ish comparison.
  if (signature.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? username : null;
}
