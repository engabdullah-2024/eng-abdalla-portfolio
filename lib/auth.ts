// ./lib/auth.ts
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const TOKEN_NAME = "admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/* ============ Env / secret ============ */
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

/* ============ Password ============ */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ============ JWT ============ */
export type TokenPayload = { id: string; email: string };

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

/* ============ Cookie store types (minimal) ============ */
type CookieReadStore = {
  get(name: string): { value: string } | undefined;
};

type CookieWriteStore = CookieReadStore & {
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
};

/* ============ Cookie helpers (pass the store in) ============ */
export function getTokenFromCookie(store: CookieReadStore): string | null {
  return store.get(TOKEN_NAME)?.value ?? null;
}

export function setAuthCookie(store: CookieWriteStore, token: string): void {
  store.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAuthCookie(store: CookieWriteStore): void {
  store.set(TOKEN_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
