"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FolderGit2, Mail, Download } from "lucide-react";

/**
 * SSR-safe, accessible typewriter.
 * - Clears timers on unmount (avoids state updates after unmount).
 * - Stable dependency arrays to satisfy eslint-plugin-react-hooks.
 */
function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1200,
  className = "",
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}) {
  const safeWords = useMemo<string[]>(
    () => (Array.isArray(words) && words.length ? words : [""]),
    [words],
  );

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // hold timer ids to clear on unmount
  const blinkTimerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);

  // Cursor blink
  useEffect(() => {
    blinkTimerRef.current = window.setInterval(() => {
      setBlink((b) => !b);
    }, 500);

    return () => {
      if (blinkTimerRef.current) window.clearInterval(blinkTimerRef.current);
    };
  }, []);

  // typing / deleting loop
  useEffect(() => {
    if (unmountedRef.current) return;

    const currentWord = safeWords[index % safeWords.length];
    const isWordComplete = !deleting && subIndex === currentWord.length;
    const isWordDeleted = deleting && subIndex === 0;

    // Pause at full word before deleting
    if (isWordComplete) {
      pauseTimerRef.current = window.setTimeout(() => {
        if (!unmountedRef.current) setDeleting(true);
      }, pauseMs);
      return () => {
        if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      };
    }

    // Next word after deletion finishes
    if (isWordDeleted) {
      // no timer needed; update immediately
      setDeleting(false);
      setIndex((i) => (i + 1) % safeWords.length);
      return undefined;
    }

    // Step typing or deleting
    stepTimerRef.current = window.setTimeout(() => {
      if (!unmountedRef.current) {
        setSubIndex((s) => s + (deleting ? -1 : 1));
      }
    }, deleting ? deletingSpeed : typingSpeed);

    return () => {
      if (stepTimerRef.current) window.clearTimeout(stepTimerRef.current);
    };
  }, [subIndex, index, deleting, pauseMs, typingSpeed, deletingSpeed, safeWords]);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      if (blinkTimerRef.current) window.clearInterval(blinkTimerRef.current);
      if (stepTimerRef.current) window.clearTimeout(stepTimerRef.current);
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const text = safeWords[index % safeWords.length].slice(0, subIndex);

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      {text}
      <span className={`inline-block w-3${blink ? " opacity-100" : " opacity-0"}`}>|</span>
    </span>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

export default function HomePage() {
  const words = useMemo(
    () => ["Eng Abdalla", "Full-Stack Developer", "MERN • Next.js • TS"],
    [],
  );

  // pre-encoded SVG grid (avoids lint about unescaped characters in template)
  const gridDataUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

  return (
    <main
      className="
        relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden
        bg-gradient-to-b from-slate-50 via-white to-slate-100
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
        px-6 py-20 text-center sm:px-8
      "
      aria-label="Home hero"
    >
      {/* LAYER 1: Linear gradient beams */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-70 dark:opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(99,102,241,0.08), transparent 45%), linear-gradient(245deg, rgba(56,189,248,0.08), transparent 40%)",
        }}
      />

      {/* LAYER 2: SVG grid (masked center) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.25]
                   [mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)]
                   [-webkit-mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)]"
        style={{
          backgroundImage: gridDataUrl,
          backgroundSize: "32px 32px",
          backgroundPosition: "center",
        }}
      />

      {/* LAYER 3: Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(60rem_60rem_at_50%_-10%,rgba(99,102,241,0.12),transparent_60%)]"
      />

      {/* LAYER 4: Blurred color orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
      />

      {/* Optional glassy focus ring behind content */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-24 -z-[1] mx-auto hidden max-w-4xl rounded-3xl border
                   border-white/20 bg-white/5 shadow-[0_0_60px_-15px_rgba(99,102,241,0.25)]
                   backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:block"
        style={{ height: "60%", filter: "saturate(1.05)" }}
      />

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-4xl">
        <motion.div
          className="mb-6 flex items-center justify-center gap-2"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
        >
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            Available for freelance &amp; internships
          </Badge>
        </motion.div>

        <motion.h1
          className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            <Typewriter words={words} typingSpeed={85} deletingSpeed={45} pauseMs={1100} />
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          I craft clean, accessible, and performant web apps with{" "}
          <span className="font-medium">Next.js, TypeScript, Tailwind, shadcn/ui</span>, and modern
          tooling. Focused on DX, scalability, and great UX.
        </motion.p>

        <motion.div
          className="mx-auto mt-8 flex w-full flex-wrap items-center justify-center gap-3"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.3 }}
        >
          <Button asChild size="lg" className="group">
            <Link href="/projects" aria-label="View my projects" prefetch>
              <FolderGit2 className="mr-2 h-5 w-5" />
              View Projects
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/contact" aria-label="Contact me" prefetch>
              <Mail className="mr-2 h-5 w-5" />
              Contact
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="hover:bg-primary/10 hover:text-primary"
          >
            <a href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="Download resume">
              <Download className="mr-2 h-5 w-5" />
              Résumé
            </a>
          </Button>
        </motion.div>

        <motion.p
          className="mt-5 text-xs text-muted-foreground"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.35 }}
        >
          • Built with Next.js 15, TypeScript, Tailwind, shadcn/ui &amp; Framer Motion •
        </motion.p>

        <motion.div
          className="mt-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
            Press <kbd className="rounded border px-1">G</kbd> then{" "}
            <kbd className="rounded border px-1">P</kbd> to open projects
          </span>
        </motion.div>
      </section>
    </main>
  );
}
