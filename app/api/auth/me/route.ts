// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const store = await cookies();
  const adminToken = await requireAdmin(store);
  if (!adminToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const admin = await prisma.admin.findUnique({
    where: { email: adminToken.email },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: "admin" as const },
  });
}
