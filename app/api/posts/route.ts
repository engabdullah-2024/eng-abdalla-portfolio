// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url(),
  author: z.string().min(1),
  slug: z.string().min(1),
});

// GET /api/posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ ok: true, posts });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST /api/posts (admin only)
export async function POST(req: Request) {
  try {
    // auth
    const store = await cookies();
    const admin = await requireAdmin(store);
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // validate
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    // create
    const post = await prisma.post.create({ data: parsed.data });
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
