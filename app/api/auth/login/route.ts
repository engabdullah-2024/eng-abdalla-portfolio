import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const TOKEN_NAME = "admin_token"; // must match your lib/auth cookie name
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });
    // Avoid leaking which field failed
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.password);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin.id, email: admin.email });

    // Set cookie on the response (works in all Next App Router versions)
    const res = NextResponse.json({ ok: true });
    res.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
