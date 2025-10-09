// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    // In some Next versions cookies() is async, so await is safest
    const store = await cookies();
    const token = getTokenFromCookie(store);

    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let payload: ReturnType<typeof verifyToken>;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: payload.email },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: "admin" as const },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
