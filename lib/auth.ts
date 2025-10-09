import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_NAME = "admin_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; email: string }) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as { id: string; email: string; iat: number; exp: number };
}

export function setAuthCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearAuthCookie() {
  cookies().set(TOKEN_NAME, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export function getTokenFromCookie() {
  return cookies().get(TOKEN_NAME)?.value || null;
}
