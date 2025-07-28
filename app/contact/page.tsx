"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

// 🔁 Replace these with your real EmailJS credentials
const SERVICE_ID = "service_emzhgfc";
const TEMPLATE_ID = "template_c06ycsp";
const PUBLIC_KEY = "6nbY0x5vkTOwEohEU";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      newErrors.email = "Invalid email address";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      .then(() => {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Something went wrong. Please try again later.");
      })
      .finally(() => setLoading(false));
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-20 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Have a project idea or want to connect? Send me a message or reach out on social media!
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="space-y-6"
      >
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

        <div>
          <label htmlFor="message" className="block mb-1 font-semibold">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            rows={5}
            required
          />
          {errors.message && (
            <p id="message-error" className="text-sm text-red-600 mt-1">
              {errors.message}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>

        {submitted && (
          <p className="text-green-600 mt-4 text-center font-medium">
            Thanks for your message! I will get back to you soon.
          </p>
        )}
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
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
          className="text-muted-foreground hover:text-gray-900 dark:hover:text-white transition"
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
    </main>
  );
}
