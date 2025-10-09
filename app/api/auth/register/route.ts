import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

const TOKEN_NAME = "admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    // Only allow first admin to be created
    const count = await prisma.admin.count();
    if (count > 0) {
      return NextResponse.json({ ok: false, error: "Registration closed" }, { status: 403 });
    }

    const { email, name, password } = parsed.data;

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email already exists" }, { status: 409 });
    }

    const hash = await hashPassword(password);
    const admin = await prisma.admin.create({ data: { email, name, password: hash } });

    const token = signToken({ id: admin.id, email: admin.email });

    // Set the cookie directly on the response (works in all App Router versions)
    const res = NextResponse.json({ ok: true, admin: { id: admin.id, email, name } });
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
