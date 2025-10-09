import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export function requireAdmin() {
  const token = getTokenFromCookie();
  if (!token) return null;
  try {
    return verifyToken(token); // { id, email, iat, exp }
  } catch {
    return null;
  }
}
