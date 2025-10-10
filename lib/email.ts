import { Resend } from "resend";

const key = process.env.RESEND_API_KEY ?? "";
export const resend = new Resend(key);

// simple guard for dev without key
export function hasEmailKey(): boolean {
  return Boolean(key && key.startsWith("re_"));
}
