// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    // Optional: size/type validation (e.g., max 5MB, images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Only image uploads allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Max file size is 5MB" }, { status: 413 });
    }

    const key = `uploads/${nanoid()}-${file.name.replace(/\s+/g, "_")}`;
    const { url } = await put(key, file, { access: "public", addRandomSuffix: false });

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Upload error:", err);
    }
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
