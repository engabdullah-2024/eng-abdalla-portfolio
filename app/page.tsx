"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Reusable, SSR-safe typewriter that types & deletes a list of words in a loop.
 * - Accessible: announces updates via aria-live
 * - Customizable speeds & pauses
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
  const safeWords = useMemo(() => (Array.isArray(words) && words.length ? words : [""]), [words]);
  const [index, setIndex] = useState(0); // which word
  const [subIndex, setSubIndex] = useState(0); // how many chars shown
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const mounted = useRef(true);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!mounted.current) return;

    const current = safeWords[index % safeWords.length];
    const isWordComplete = !deleting && subIndex === current.length;
    const isWordDeleted = deleting && subIndex === 0;

    // Pause at full word before deleting
    if (isWordComplete) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    // Move to next word after deletion finishes
    if (isWordDeleted) {
      setDeleting(false);
      setIndex((i) => (i + 1) % safeWords.length);
      return;
    }

    const nextInterval = setTimeout(() => {
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(nextInterval);
  }, [subIndex, index, deleting, pauseMs, typingSpeed, deletingSpeed, safeWords]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const text = safeWords[index % safeWords.length].slice(0, subIndex);

  return (
    <span className={className} aria-live="polite" aria-atomic>
      {text}
      <span className={"inline-block w-3" + (blink ? " opacity-100" : " opacity-0")}>|</span>
    </span>
  );
}

export default function HomePage() {
  const words = ["Eng Abdalla", "Fullstack Dev"]; // cycles and retypes

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Hi, I&apos;m
          {" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            <Typewriter
              words={words}
              typingSpeed={85}
              deletingSpeed={45}
              pauseMs={1100}
              className=""
            />
          </span>
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key="subtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            A passionate full‑stack developer crafting modern web apps using
            <br />
            Next.js, TypeScript, Tailwind CSS & more.
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <Link href="/projects">
          <Button size="lg" className="mt-4">
            View My Projects
          </Button>
        </Link>
      </motion.div>

      {/* Scroll Down CTA */}
      <motion.div
        className="mt-20 animate-bounce text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Link href="#about">
          <span className="text-sm">Scroll down to learn more ↓</span>
        </Link>
      </motion.div>
    </main>
  );
}
