// app/hero/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type MotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";

// typed helper for Framer Motion props
const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function HeroPage() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Card container */}
      <div className="mx-auto max-w-[1200px] rounded-[28px] overflow-hidden bg-white/80 backdrop-blur border border-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.06)] dark:bg-white/5 dark:border-white/10 dark:shadow-[0_25px_80px_rgba(0,0,0,.55)]">
        {/* Grid */}
        <div className="grid items-center gap-10 md:gap-12 p-6 sm:p-8 md:p-10 md:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* name tag */}
            <motion.span
              {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-700 dark:text-white/80"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-brand" />
              Eng Abdalla
            </motion.span>

            {/* headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-display font-extrabold leading-[1.05] text-[clamp(2rem,4.2vw,3.5rem)] text-neutral-950 dark:text-white"
            >
              Transforming Ideas
              <br />
              Into <span className="text-brand">Digital Reality</span>
            </motion.h1>

            {/* copy */}
            <motion.p
              {...fadeUp(0.35)}
              className="max-w-[56ch] text-base md:text-[17px] leading-relaxed text-neutral-600 dark:text-white/70"
            >
              I’m Eng Abdalla — I craft premium, performance-focused web
              experiences with modern stacks. Clean code, sleek UI, and real-world
              impact.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="bg-brand hover:bg-brand/90 text-black font-semibold rounded-xl px-6 dark:text-white"
              >
                <Link href="/projects">View Projects</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-neutral-300 text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 rounded-xl"
              >
                <Link href="/contact">Let’s Talk</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Portrait with refined sizing + glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative mx-auto md:mx-0 w-full max-w-[420px] md:max-w-none"
          >
            {/* animated glow */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-8 -z-10 rounded-[36px]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,59,48,.28), transparent 70%)",
              }}
            />

            <div className="rounded-[26px] overflow-hidden bg-neutral-50 border border-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,.08)] dark:bg-white/5 dark:border-white/10 dark:shadow-[0_25px_80px_rgba(0,0,0,.55)]">
              <Image
                src="/eng.jpg"
                alt="Eng Abdalla portrait"
                width={640}
                height={820}
                priority
                className="h-auto w-full object-cover md:aspect-[4/5]"
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 420px, 90vw"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Optional subtle floating dots for depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[6%] top-[20%] h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-white/20" />
        <div className="absolute left-[24%] top-[72%] h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-white/20" />
        <div className="absolute right-[22%] top-[42%] h-1.5 w-1.5 rounded-full bg-brand/80 blur-[1px]" />
      </div>

      {/* anchor for scroll-to-bottom behavior */}
      <div id="end" className="mt-12" />
    </section>
  );
}
