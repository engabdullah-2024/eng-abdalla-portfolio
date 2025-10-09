// ./lib/auth.ts
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies as nextCookies } from "next/headers";

const TOKEN_NAME = "admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/* ======================
   Env / secret
   ====================== */
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

/* ======================
   Type guards for cookies()
   ====================== */
type ReadCookieValue = { name: string; value: string } | undefined;

// Minimal shape for a mutable cookies object (route handlers / server actions)
type MutableCookies = {
  get(name: string): ReadCookieValue;
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
      path?: string;
      maxAge?: number;
    },
  ): void;
  delete(name: string, options?: { path?: string }): void;
};

// Runtime guard: does this cookies() object support .set()?
function isMutableCookies(obj: unknown): obj is MutableCookies {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as { set?: unknown }).set === "function"
  );
}

/* ======================
   Password helpers
   ====================== */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ======================
   JWT helpers
   ====================== */
export type TokenPayload = {
  id: string;
  email: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: MAX_AGE_SECONDS });
}

export function verifyToken(token: string): TokenPayload & JwtPayload {
  const decoded = jwt.verify(token, getSecret());
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }
  return decoded as TokenPayload & JwtPayload;
}

/* ======================
   Cookie helpers
   ====================== */

/** Read the auth token safely from any server context (RSC or Route). */
export function getTokenFromCookie(): string | null {
  const c = nextCookies();
  const v = c.get(TOKEN_NAME)?.value;
  return v ?? null;
}

/**
 * Set the auth cookie.
 * Must be called from a **Route Handler** or **Server Action** (mutable cookies context).
 */
export function setAuthCookie(token: string): void {
  const c = nextCookies();
  if (!isMutableCookies(c)) {
    throw new Error("setAuthCookie() can only be used in Route Handlers or Server Actions.");
  }
  c.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/**
 * Clear the auth cookie.
 * Must be called from a **Route Handler** or **Server Action** (mutable cookies context).
 */
export function clearAuthCookie(): void {
  const c = nextCookies();
  if (!isMutableCookies(c)) {
    throw new Error("clearAuthCookie() can only be used in Route Handlers or Server Actions.");
  }
  // Using set with maxAge 0 provides consistent deletion semantics across runtimes.
  c.set(TOKEN_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
