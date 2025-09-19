// app/contact/page.tsx
"use client";

import type { ChangeEvent, FormEvent, ComponentType } from "react";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Monitor,
  Code2,
  Palette,
  Server,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ---- Background assets (encoded / stable) ----
const GRID_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

const LINEAR_BEAMS =
  "linear-gradient(115deg, rgba(56,189,248,0.08), transparent 45%), linear-gradient(245deg, rgba(99,102,241,0.08), transparent 40%)";

// ---- Motion variants (stable) ----
const headerIn = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

const sectionIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

// ---- EmailJS (consider using env vars or API route in production) ----
const SERVICE_ID = "service_oab4tqx";
const TEMPLATE_ID = "template_yy6fly9";
const PUBLIC_KEY = "6nbY0x5vkTOwEohEU";

// ---- Form types ----
type ServiceKind = "Web Design" | "Web Development" | "Graphic Design" | "Web Hosting" | "";
type FormState = {
  name: string;
  email: string;
  service: ServiceKind;
  message: string;
  website?: string; // honeypot
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // validation
  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())) {
      newErrors.email = "Invalid email address";
    }
    if (!form.service) newErrors.service = "Please select a service";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    if (form.website && form.website.trim().length > 0) newErrors.website = "Spam detected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setLoading(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      service_type: form.service,
      message: form.message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
      setStatus({ ok: true, msg: "Thanks! Your message has been sent." });
      setForm({ name: "", email: "", service: "", message: "", website: "" });
      formRef.current?.reset();
    } catch {
      setStatus({
        ok: false,
        msg: "Something went wrong sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative isolate min-h-[100svh] px-6 py-20 sm:px-10
        bg-gradient-to-b from-slate-50 via-white to-slate-100
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      {/* Background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 opacity-70 dark:opacity-80"
        style={{ backgroundImage: LINEAR_BEAMS }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35] dark:opacity-[0.25]
                   [mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)]
                   [-webkit-mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)]"
        style={{
          backgroundImage: GRID_DATA_URL,
          backgroundSize: "32px 32px",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={headerIn.initial}
          animate={headerIn.animate}
          transition={headerIn.transition}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold">Let’s Work Together</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            I build modern, fast, and beautiful web experiences. Choose a service or drop me a
            message — I’ll reply quickly.
          </p>
        </motion.div>

        {/* Services */}
        <section aria-labelledby="services" className="mb-16">
          <h2 id="services" className="mb-6 text-center text-2xl font-semibold">
            Services I Offer
          </h2>
          <motion.div
            initial={sectionIn.initial}
            animate={sectionIn.animate}
            transition={sectionIn.transition}
            className="grid gap-6 sm:grid-cols-2"
          >
            <ServiceCard
              Icon={Monitor}
              title="Web Design"
              desc="Clean, responsive UI/UX with attention to detail, accessibility, and brand consistency."
            />
            <ServiceCard
              Icon={Code2}
              title="Web Development"
              desc="Production-grade Next.js/TypeScript builds with modern tooling, auth, and APIs."
            />
            <ServiceCard
              Icon={Palette}
              title="Graphic Design"
              desc="Logos, social media kits, and visuals that make your brand memorable."
            />
            <ServiceCard
              Icon={Server}
              title="Web Hosting"
              desc="Fast, secure hosting setups with CI/CD, custom domains, and monitoring."
            />
          </motion.div>
        </section>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Contact Me</h2>
            <p className="text-muted-foreground">
              Have a project idea or want to connect? Send me a message or reach out on social
              media!
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* name + email */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block font-semibold">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  required
                />
                {errors.name ? (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block font-semibold">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  required
                />
                {errors.email ? (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            {/* service */}
            <div>
              <label htmlFor="service" className="mb-1 block font-semibold">
                Service
              </label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? "service-error" : undefined}
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="Web Design">Web Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Web Hosting">Web Hosting</option>
              </select>
              {errors.service ? (
                <p id="service-error" className="mt-1 text-sm text-red-600">
                  {errors.service}
                </p>
              ) : null}
            </div>

            {/* message */}
            <div>
              <label htmlFor="message" className="mb-1 block font-semibold">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project, goals, and timeline..."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows={6}
                required
              />
              {errors.message ? (
                <p id="message-error" className="mt-1 text-sm text-red-600">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {/* honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
              {errors.website ? (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              ) : null}
            </div>

            {/* submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>

            {/* live region */}
            {status ? (
              <div
                className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                  status.ok ? "border-green-200 text-green-700" : "border-red-200 text-red-700"
                }`}
                role="status"
                aria-live="polite"
              >
                {status.ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span>{status.msg}</span>
              </div>
            ) : null}
          </form>

          {/* socials */}
          <motion.div
            initial={sectionIn.initial}
            animate={sectionIn.animate}
            transition={{ ...sectionIn.transition, delay: 0.2 }}
            className="mt-16 flex justify-center gap-10"
          >
            <a
              href="mailto:your.email@example.com"
              aria-label="Send Email"
              className="text-muted-foreground transition hover:text-blue-600"
            >
              <Mail size={32} />
            </a>
            <a
              href="https://github.com/engabdullah-2024"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-muted-foreground transition hover:text-foreground"
            >
              <Github size={32} />
            </a>
            <a
              href="https://linkedin.com/in/engabdalla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-muted-foreground transition hover:text-blue-700"
            >
              <Linkedin size={32} />
            </a>
            <a
              href="https://twitter.com/engabdalla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
              className="text-muted-foreground transition hover:text-sky-500"
            >
              <Twitter size={32} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

// Reusable service card
function ServiceCard({
  Icon,
  title,
  desc,
}: {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border bg-card p-5 shadow-sm ring-1 ring-black/5 backdrop-blur md:backdrop-blur-lg dark:ring-white/10"
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border">
          <Icon size={20} />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </motion.article>
  );
}
