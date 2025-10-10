import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, type ContactInput } from "@/lib/validators/contact";

export const runtime = "nodejs";

type Hit = { count: number; ts: number };
const hits = new Map<string, Hit>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = Number(process.env.CONTACT_RATE_LIMIT ?? "8");

function sanitizeHeader(v: string | null): string | null {
  if (!v) return null;
  return v.replace(/[\r\n]+/g, " ").slice(0, 400);
}
function hasEmailKey(): boolean {
  const key = process.env.RESEND_API_KEY ?? "";
  return Boolean(key && key.startsWith("re_"));
}

function buildPlainText(data: ContactInput, ip: string | null, ua: string | null): string {
  return [
    "New Contact Submission",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Service: ${data.service}`,
    "",
    data.message,
    "",
    `IP: ${ip ?? "N/A"}  UA: ${ua ?? "N/A"}`,
  ].join("\n");
}

function buildHtml(data: ContactInput, ip: string | null, ua: string | null): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const gridBg =
    "background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E%3Cpath d=%27M32 0H0v32%27 fill=%27none%27 stroke=%27%23e2e8f0%27 stroke-width=%271%27/%3E%3C/svg%3E');background-size:32px 32px;background-position:center;";
  const headerGrad = "background:linear-gradient(135deg,rgba(56,189,248,0.9),rgba(99,102,241,0.9));";

  return `
  <div style="margin:0;padding:0;background:#f8fafc;${gridBg}font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;">
    <div style="max-width:680px;margin:24px auto;border-radius:16px;border:1px solid #e2e8f0;background:#ffffff;box-shadow:0 6px 24px rgba(2,6,23,0.06);overflow:hidden;">
      <div style="${headerGrad}padding:18px 22px;position:relative;">
        <div style="position:absolute;inset:0;box-shadow:inset 0 -40px 80px rgba(255,255,255,0.15)"></div>
        <h1 style="margin:0;font-size:18px;line-height:1.4;color:#f8fafc;letter-spacing:.2px;">New Contact Submission</h1>
        <p style="margin:2px 0 0 0;font-size:13px;color:#e2e8f0;opacity:.9;">A new message was submitted from your portfolio contact form.</p>
      </div>
      <div style="padding:20px 24px 8px 24px;">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style="border-collapse:separate;border-spacing:0 10px;">
          <tr><td style="width:120px;padding:0;color:#475569;font-size:13px;">Name</td><td style="padding:0;font-weight:600;color:#0f172a;">${esc(data.name)}</td></tr>
          <tr><td style="width:120px;padding:0;color:#475569;font-size:13px;">Email</td><td style="padding:0;"><a href="mailto:${esc(data.email)}" style="color:#2563eb;text-decoration:none">${esc(data.email)}</a></td></tr>
          <tr><td style="width:120px;padding:0;color:#475569;font-size:13px;">Service</td><td style="padding:0;"><span style="display:inline-block;padding:2px 8px;border-radius:999px;border:1px solid #e2e8f0;background:#f8fafc;font-size:12px;color:#0f172a;">${esc(data.service)}</span></td></tr>
        </table>
        <div style="height:1px;background:#e2e8f0;margin:14px 0;"></div>
        <div><div style="margin:0 0 6px 0;color:#475569;font-size:13px;">Message</div>
          <pre style="white-space:pre-wrap;word-wrap:break-word;line-height:1.65;margin:0;font-family:inherit;font-size:14px;color:#0f172a;">${esc(data.message)}</pre>
        </div>
        <div style="height:1px;background:#e2e8f0;margin:16px 0;"></div>
        <p style="margin:0 0 6px 0;color:#64748b;font-size:12px;">IP: ${esc(ip ?? "N/A")} • UA: ${esc(ua ?? "N/A")}</p>
        <p style="margin:0 0 18px 0;color:#94a3b8;font-size:11px;">Sent from Eng Abdalla · Next.js 15 · TypeScript · Tailwind · shadcn/ui · Framer Motion</p>
      </div>
    </div>
  </div>
  `.trim();
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("cf-connecting-ip") ?? null;
    const ua = sanitizeHeader(req.headers.get("user-agent"));

    if (ip) {
      const now = Date.now();
      const prev = hits.get(ip);
      if (!prev || now - prev.ts > WINDOW_MS) {
        hits.set(ip, { count: 1, ts: now });
      } else {
        const next = { count: prev.count + 1, ts: prev.ts };
        hits.set(ip, next);
        if (next.count > MAX_HITS) {
          return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
        }
      }
    }

    let bodyUnknown: unknown;
    try {
      bodyUnknown = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(bodyUnknown);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ") || "Invalid input";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    const data: ContactInput = parsed.data;

    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: "Thanks! We’ll be in touch soon." }, { status: 200 });
    }

    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM;
    if (!to || !from) {
      return NextResponse.json(
        { ok: false, error: "Server not configured. Missing CONTACT_TO or CONTACT_FROM environment variables." },
        { status: 500 },
      );
    }

    if (!hasEmailKey()) {
      return NextResponse.json({ ok: true, message: "Message accepted (dev mode). I’ll reply shortly!" }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const { error } = await resend.emails.send({
      to,
      from,
      // ✅ FIX HERE
      replyTo: data.email,
      subject: `New Contact: ${data.service} — ${data.name}`,
      text: buildPlainText(data, ip, ua),
      html: buildHtml(data, ip, ua),
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to send email. Please try again shortly or use a social link." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Thanks! Your message was sent — I’ll reply soon." }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
