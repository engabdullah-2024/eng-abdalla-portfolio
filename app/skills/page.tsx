"use client";

import { motion } from "framer-motion";
import { skills } from "../data/skills";

// ---- Background assets (encoded / stable) ----
const GRID_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

const LINEAR_BEAMS =
  "linear-gradient(115deg, rgba(56,189,248,0.08), transparent 45%), linear-gradient(245deg, rgba(99,102,241,0.08), transparent 40%)";

// ---- Motion variants (stable) ----
const headerIn = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const gridIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.25, duration: 0.6, ease: "easeOut" },
} as const;

export default function SkillsPage() {
  return (
    <main
      className="
        relative isolate min-h-[100svh] px-6 py-20 sm:px-10
        bg-gradient-to-b from-slate-50 via-white to-slate-100
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      {/* LAYER 1: linear beams */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 opacity-70 dark:opacity-80"
        style={{ backgroundImage: LINEAR_BEAMS }}
      />
      {/* LAYER 2: SVG grid (masked center) */}
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
      {/* LAYER 3: blurred color orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <motion.header
          initial={headerIn.initial}
          animate={headerIn.animate}
          transition={headerIn.transition}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full border px-3 py-1 text-xs text-muted-foreground">
            Stack & Tooling
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            My Skills &amp; Tools
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            A comprehensive list of technologies and tools I use to build scalable, modern web applications.
          </p>
        </motion.header>

        {/* Skills Grid */}
        <motion.section
          initial={gridIn.initial}
          animate={gridIn.animate}
          transition={gridIn.transition}
          aria-label="Skills"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5"
        >
          {skills.map(({ name, Icon, color }) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.03 }}
              className="
                group flex flex-col items-center rounded-2xl
                border border-white/20 bg-white/50 p-5 text-center shadow-sm
                ring-1 ring-black/5 backdrop-blur-md transition-all
                hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:ring-white/10
              "
              tabIndex={0}
              aria-label={name}
            >
              {/* Icon wrapper for consistent sizing */}
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background/60 ring-1 ring-black/5 dark:ring-white/10">
                {/* Icon component from data; className/color comes from data */}
                <Icon className={`h-10 w-10 ${color}`} aria-hidden="true" />
              </div>
              <span className="mt-3 text-sm font-medium text-foreground">{name}</span>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </main>
  );
}
