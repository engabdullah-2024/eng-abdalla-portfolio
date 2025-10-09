import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });

  const valid = await verifyPassword(password, admin.password);
  if (!valid) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ id: admin.id, email: admin.email });
  setAuthCookie(token);
  return NextResponse.json({ ok: true });
}
