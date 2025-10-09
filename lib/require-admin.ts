// ./lib/require-admin.ts
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export type AdminToken = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

// Minimal read-only cookie store shape (matches what lib/auth expects)
export type CookieReadStore = {
  get(name: string): { value: string } | undefined;
};

/**
 * Verify the current admin from a provided cookie store.
 * Callers should pass `await cookies()` from a Route Handler.
 *
 * Example:
 *   import { cookies } from "next/headers";
 *   const store = await cookies();
 *   const admin = await requireAdmin(store);
 */
export async function requireAdmin(store: CookieReadStore): Promise<AdminToken | null> {
  const token = getTokenFromCookie(store);
  if (!token) return null;

  try {
    return verifyToken(token) as AdminToken;
  } catch {
    return null;
  }
}
