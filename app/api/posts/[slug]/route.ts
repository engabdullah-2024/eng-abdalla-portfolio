// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  author: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

// GET /api/posts/[slug]
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/posts/[slug] (admin only)
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const store = await cookies();
    const admin = await requireAdmin(store);
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    const code =
      msg === "Record to update not found." || /not found/i.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}

// DELETE /api/posts/[slug] (admin only)
export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const store = await cookies();
    const admin = await requireAdmin(store);
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.post.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true, message: "Deleted" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    const code =
      msg === "Record to delete does not exist." || /not exist/i.test(msg) ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
