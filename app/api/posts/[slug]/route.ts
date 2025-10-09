// app/api/posts/[slug]/route.ts
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

type RouteCtx = { params: { slug: string } };

function getSlug(ctx: unknown): string {
  const slug = (ctx as Partial<RouteCtx>)?.params?.slug;
  if (!slug) {
    // If this ever happens, respond 400 — missing dynamic segment
    throw new Error("Missing slug");
  }
  return slug;
}

// GET /api/posts/[slug]
export async function GET(_req: Request, context: unknown) {
  try {
    const slug = getSlug(context);
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/posts/[slug] (admin only)
export async function PUT(req: Request, context: unknown) {
  if (!requireAdmin()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slug = getSlug(context);
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const post = await prisma.post.update({ where: { slug }, data: parsed.data });
    return NextResponse.json({ ok: true, post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid request";
    const status = msg === "Missing slug" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

// DELETE /api/posts/[slug] (admin only)
export async function DELETE(_req: Request, context: unknown) {
  if (!requireAdmin()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slug = getSlug(context);
    await prisma.post.delete({ where: { slug } });
    return NextResponse.json({ ok: true, message: "Deleted" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid request";
    const status = msg === "Missing slug" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
