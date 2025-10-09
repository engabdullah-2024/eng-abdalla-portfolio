import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";

const UpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  author: z.string().optional(),
  slug: z.string().optional(),
});

// GET /api/posts/[slug]
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, post });
}

// PUT /api/posts/[slug] (admin only)
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdmin()) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });

  const post = await prisma.post.update({ where: { slug: params.slug }, data: parsed.data });
  return NextResponse.json({ ok: true, post });
}

// DELETE /api/posts/[slug] (admin only)
export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  if (!requireAdmin()) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  await prisma.post.delete({ where: { slug: params.slug } });
  return NextResponse.json({ ok: true, message: "Deleted" });
}
