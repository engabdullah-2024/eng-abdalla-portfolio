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
   cookies() normalization
   (handles both sync and async cookies() across Next versions)
   ====================== */
function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (v as any)?.then === "function";
}

// Minimal shape we need from cookies()
type CookiesShape = {
  get(name: string): { name: string; value: string } | undefined;
  set?(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
      path?: string;
      maxAge?: number;
    }
  ): void;
};

// Always return a resolved cookies object (sync or async)
async function getCookies(): Promise<CookiesShape> {
  const c = nextCookies() as unknown;
  return isPromise(c) ? await c : (c as CookiesShape);
}

function isMutable(c: CookiesShape): c is CookiesShape & Required<Pick<CookiesShape, "set">> {
  return typeof c.set === "function";
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
export async function getTokenFromCookie(): Promise<string | null> {
  const c = await getCookies();
  return c.get(TOKEN_NAME)?.value ?? null;
}

/**
 * Set the auth cookie.
 * Must be called from a **Route Handler** or **Server Action** (mutable cookies context).
 */
export async function setAuthCookie(token: string): Promise<void> {
  const c = await getCookies();
  if (!isMutable(c)) {
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
export async function clearAuthCookie(): Promise<void> {
  const c = await getCookies();
  if (!isMutable(c)) {
    throw new Error("clearAuthCookie() can only be used in Route Handlers or Server Actions.");
  }
  c.set(TOKEN_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
