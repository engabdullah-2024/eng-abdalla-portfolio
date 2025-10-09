import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });

  // Only allow first admin to be created
  const count = await prisma.admin.count();
  if (count > 0) {
    return NextResponse.json({ ok: false, error: "Registration closed" }, { status: 403 });
  }

  const { email, name, password } = parsed.data;
  const exists = await prisma.admin.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ ok: false, error: "Email already exists" }, { status: 409 });

  const hash = await hashPassword(password);
  const admin = await prisma.admin.create({ data: { email, name, password: hash } });
  const token = signToken({ id: admin.id, email: admin.email });
  setAuthCookie(token);

  return NextResponse.json({ ok: true, admin: { id: admin.id, email, name } });
}
