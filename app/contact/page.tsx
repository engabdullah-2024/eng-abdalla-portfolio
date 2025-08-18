"use client";

import { useRef, useState } from "react";
// ✅ Prefer the maintained browser SDK
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

// 🔁 Your real EmailJS credentials
const SERVICE_ID = "service_oab4tqx";
const TEMPLATE_ID = "template_yy6fly9";
const PUBLIC_KEY = "6nbY0x5vkTOwEohEU";

type FormState = {
  name: string;
  email: string;
  service: "Web Design" | "Web Development" | "Graphic Design" | "Web Hosting" | "";
  message: string;
  // Honeypot (hidden) to deter bots
  website?: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())) {
      newErrors.email = "Invalid email address";
    }
    if (!form.service) newErrors.service = "Please select a service";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    // If honeypot has content, treat as invalid
    if (form.website && form.website.trim().length > 0) {
      newErrors.website = "Spam detected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setLoading(true);

    // EmailJS expects template params (keys must match your template on EmailJS)
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      service_type: form.service, // <- create {{service_type}} variable in your EmailJS template
      message: form.message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      });
      setStatus({ ok: true, msg: "Thanks! Your message has been sent." });
      setForm({ name: "", email: "", service: "", message: "", website: "" });
      // Optionally reset the native form
      formRef.current?.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({
        ok: false,
        msg: "Something went wrong sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-20 sm:px-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Let’s Work Together</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          I build modern, fast, and beautiful web experiences. Choose a service or drop me a message — I’ll reply quickly.
        </p>
      </motion.div>

      {/* Services */}
      <section aria-labelledby="services" className="mb-16">
        <h2 id="services" className="text-2xl font-semibold mb-6 text-center">
          Services I Offer
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Contact Me</h2>
          <p className="text-muted-foreground">
            Have a project idea or want to connect? Send me a message or reach out on social media!
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                required
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="service" className="block mb-1 font-semibold">
              Service
            </label>
            <select
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-invalid={!!errors.service}
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
            {errors.service && (
              <p id="service-error" className="text-sm text-red-600 mt-1">
                {errors.service}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-semibold">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project, goals, and timeline..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              rows={6}
              required
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-600 mt-1">
                {errors.message}
              </p>
            )}
          </div>

          {/* Honeypot – keep hidden */}
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
            {errors.website && (
              <p className="text-sm text-red-600 mt-1">{errors.website}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>

          {/* Live status */}
          {status && (
            <div
              className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                status.ok
                  ? "border-green-200 text-green-700"
                  : "border-red-200 text-red-700"
              }`}
              role="status"
              aria-live="polite"
            >
              {status.ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>{status.msg}</span>
            </div>
          )}
        </form>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 flex justify-center gap-10"
        >
          <a
            href="mailto:your.email@example.com"
            aria-label="Send Email"
            className="text-muted-foreground hover:text-blue-600 transition"
          >
            <Mail size={32} />
          </a>
          <a
            href="https://github.com/engabdullah-2024"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Github size={32} />
          </a>
          <a
            href="https://linkedin.com/in/engabdalla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-muted-foreground hover:text-blue-700 transition"
          >
            <Linkedin size={32} />
          </a>
          <a
            href="https://twitter.com/engabdalla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="text-muted-foreground hover:text-sky-500 transition"
          >
            <Twitter size={32} />
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}

/** --- Small service card component --- */
function ServiceCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border">
          <Icon size={20} />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </motion.article>
  );
}
