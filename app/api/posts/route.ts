import { NextResponse } from "next/server";
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
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json({ ok: true, posts });
}

// POST /api/posts (admin only)
export async function POST(req: Request) {
  if (!requireAdmin()) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });

  const post = await prisma.post.create({ data: parsed.data });
  return NextResponse.json({ ok: true, post });
}
