// app/api/contact/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   Validation schema
   ========================= */
const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  service: z.enum(["Web Design", "Web Development", "Graphic Design", "Web Hosting"]),
  message: z.string().min(1).max(5000),
  website: z.string().optional().default(""), // honeypot
});

/* =========================
   Simple in-memory rate limiter (per IP / 60s)
   ========================= */
const WINDOW_MS = 60_000;
const MAX_HITS = 4;

type HitRec = { t: number; n: number };

declare global {
  var __contact_hits__: Map<string, HitRec> | undefined;
}

const hits: Map<string, HitRec> = globalThis.__contact_hits__ ?? new Map<string, HitRec>();
globalThis.__contact_hits__ = hits;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.t > WINDOW_MS) {
    hits.set(ip, { t: now, n: 1 });
    return true;
  }
  if (rec.n >= MAX_HITS) return false;
  rec.n += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/* =========================
   Helpers: escape + email validation
   ========================= */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmailAddress(s: string): boolean {
  // RFC5322-light, good enough for Reply-To; Resend also validates server-side.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/* =========================
   Polished HTML email
   ========================= */
function makeEmailHtml({
  name,
  email,
  service,
  message,
  ip,
  brand = "Portfolio",
  replyToHref,
}: {
  name: string;
  email: string;
  service: string;
  message: string;
  ip: string;
  brand?: string;
  replyToHref: string;
}) {
  const preheader = `New ${service} inquiry from ${name}`;
  const accent = "#4f46e5"; // indigo-600
  const border = "#e5e7eb"; // gray-200
  const textMuted = "#6b7280"; // gray-500
  const bg = "#f6f9fc";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${esc(brand)} – New inquiry</title>
    <style>
      .preheader { display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
      @media (prefers-color-scheme: dark) {
        :root { color-scheme: light only; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:${bg};">
    <span class="preheader">${esc(preheader)}</span>

    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background:${bg}; padding:24px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:640px; background:#ffffff; border-radius:16px; border:1px solid ${border}; overflow:hidden;">
            <tr>
              <td style="padding:24px; background:linear-gradient(135deg, ${accent}, #7c3aed);">
                <div style="display:inline-block; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,0.15); color:#fff; font:600 14px/1.1 system-ui, -apple-system, Segoe UI, Roboto;">
                  ${esc(brand)}
                </div>
                <h1 style="margin:12px 0 0; font:700 22px/1.2 system-ui, -apple-system, Segoe UI, Roboto; color:#fff;">
                  New ${esc(service)} inquiry from ${esc(name)}
                </h1>
                <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font:400 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">
                  Someone just contacted you from your website.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;">
                <table role="presentation" width="100%" style="border:1px solid ${border}; border-radius:12px;" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style="padding:16px 18px;">
                      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style="padding:6px 0; width:120px; color:${textMuted}; font:600 13px system-ui, -apple-system, Segoe UI, Roboto;">Name</td>
                          <td style="padding:6px 0; font:500 14px system-ui, -apple-system, Segoe UI, Roboto;">${esc(name)}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; color:${textMuted}; font:600 13px system-ui, -apple-system, Segoe UI, Roboto;">Email</td>
                          <td style="padding:6px 0; font:500 14px system-ui, -apple-system, Segoe UI, Roboto;">
                            <a href="mailto:${esc(email)}" style="color:${accent}; text-decoration:none;">${esc(email)}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; color:${textMuted}; font:600 13px system-ui, -apple-system, Segoe UI, Roboto;">Service</td>
                          <td style="padding:6px 0; font:500 14px system-ui, -apple-system, Segoe UI, Roboto;">${esc(service)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <div style="margin:18px 0 0;">
                  <div style="margin:0 0 8px; color:${textMuted}; font:700 13px system-ui, -apple-system, Segoe UI, Roboto;">Message</div>
                  <div style="border:1px solid ${border}; border-radius:12px; padding:14px; font:400 15px/1.6 system-ui, -apple-system, Segoe UI, Roboto; color:#0f172a; white-space:pre-wrap;">
                    ${esc(message || "(no message provided)")}
                  </div>
                </div>

                <table role="presentation" cellPadding="0" cellSpacing="0" style="margin:20px 0 0;">
                  <tr>
                    <td>
                      <a href="${replyToHref}" style="display:inline-block; background:${accent}; color:#ffffff; padding:12px 16px; border-radius:10px; font:600 14px system-ui, -apple-system, Segoe UI, Roboto; text-decoration:none;">
                        Reply to ${esc(name)}
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0; color:${textMuted}; font:400 12px system-ui, -apple-system, Segoe UI, Roboto;">
                  IP: ${esc(ip)} · Sent ${new Date().toLocaleString()}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px; border-top:1px solid ${border}; background:#fafafa; color:${textMuted}; font:400 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">
                You’re receiving this because someone submitted the contact form on your site.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function makeEmailText({
  name,
  email,
  service,
  message,
  ip,
}: {
  name: string;
  email: string;
  service: string;
  message: string;
  ip: string;
}) {
  return `New ${service} inquiry from ${name}

Name: ${name}
Email: ${email}
Service: ${service}

Message:
${message || "(no message provided)"}

IP: ${ip}
Sent: ${new Date().toLocaleString()}
`;
}

/* =========================
   POST handler
   ========================= */
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM" },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const ip = getClientIp(req);

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Try again in a minute." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const { name, email, service, message, website } = parsed.data;

    // Honeypot (bots): pretend success
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: "Sent!" });
    }

    const subject = `New ${service} inquiry from ${name}`;
    const html = makeEmailHtml({
      name,
      email,
      service,
      message,
      ip,
      brand: "Portfolio",
      replyToHref: `mailto:${esc(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`,
    });
    const text = makeEmailText({ name, email, service, message, ip });

    // Build payload and only include reply_to if the address is valid.
    const payload: Parameters<typeof resend.emails.send>[0] = {
      to,
      from,
      subject,
      html,
      text,
    };
    if (isValidEmailAddress(email)) {
      (payload as { reply_to?: string[] }).reply_to = [email];
    }

    const { error } = await resend.emails.send(payload);

    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Resend error:", error);
      }
      return NextResponse.json(
        { ok: false, error: error.message || "Email provider error. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Sent!" });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Contact route error:", err);
    }
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 });
  }
}
