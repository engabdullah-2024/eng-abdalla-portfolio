// app/about/page.tsx
"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type MotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiJavascript,
} from "react-icons/si";

type Tech = { icon: ReactNode; name: string };

// Typed, reusable motion preset
const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

export default function AboutPage() {
  const techIcons: Tech[] = [
    { icon: <FaReact className="text-sky-500" />, name: "React" },
    { icon: <SiNextdotjs className="text-neutral-900 dark:text-white" />, name: "Next.js" },
    { icon: <SiTypescript className="text-blue-600" />, name: "TypeScript" },
    { icon: <SiJavascript className="text-yellow-500" />, name: "JavaScript" },
    { icon: <SiTailwindcss className="text-cyan-500" />, name: "Tailwind CSS" },
    { icon: <FaNodeJs className="text-green-600" />, name: "Node.js" },
    { icon: <SiExpress className="text-neutral-700 dark:text-neutral-300" />, name: "Express.js" },
    { icon: <SiMongodb className="text-emerald-500" />, name: "MongoDB" },
    { icon: <FaGithub className="text-neutral-900 dark:text-white" />, name: "GitHub" },
    { icon: <FaGitAlt className="text-red-500" />, name: "Git" },
    { icon: <FaHtml5 className="text-orange-600" />, name: "HTML5" },
    { icon: <FaCss3Alt className="text-blue-600" />, name: "CSS3" },
  ];

  return (
    <main className="relative px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* HERO-STYLE CARD */}
      <section
        className="
          mx-auto max-w-[1200px]
          rounded-[28px] overflow-hidden
          bg-white/80 backdrop-blur border border-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.06)]
          dark:bg-white/5 dark:border-white/10 dark:shadow-[0_25px_80px_rgba(0,0,0,.55)]
        "
      >
        <div
          className="
            grid items-center
            gap-10 md:gap-12
            p-6 sm:p-8 md:p-10
            md:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]
          "
        >
          {/* LEFT: Bio text */}
          <motion.div {...fadeUp(0.05)} className="space-y-6">
            <motion.span
              {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-700 dark:text-white/80"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-brand" />
              Eng Abdalla
            </motion.span>

            <motion.h1
              {...fadeUp(0.18)}
              className="font-display font-extrabold leading-[1.05] text-[clamp(2rem,4.2vw,3.2rem)] text-neutral-950 dark:text-white"
            >
              About Me
            </motion.h1>

            <motion.p
              {...fadeUp(0.26)}
              className="max-w-[60ch] text-base md:text-[17px] leading-relaxed text-neutral-600 dark:text-white/70"
            >
              I&apos;m <strong>Eng Abdalla</strong>, a product-minded full-stack developer focused
              on performance, accessibility, and elegant UI. I love building modern web experiences
              with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Tailwind</strong>,
              and <strong>MongoDB</strong> — turning complex ideas into delightful, reliable products.
            </motion.p>

            <motion.div {...fadeUp(0.34)} className="flex flex-wrap items-center gap-3 pt-1">
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
                <Link href="/abdalla.pdf" target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Portrait + subtle glow */}
          <motion.div
            {...fadeUp(0.18)}
            className="relative mx-auto md:mx-0 w-full max-w-[420px] md:max-w-none"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-8 -z-10 rounded-[36px]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,59,48,.28), transparent 70%)",
              }}
            />
            <div
              className="
                rounded-[26px] overflow-hidden
                bg-neutral-50 border border-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,.08)]
                dark:bg-white/5 dark:border-white/10 dark:shadow-[0_25px_80px_rgba(0,0,0,.55)]
              "
            >
              <Image
                src="/eng.jpg"
                alt="Eng Abdalla"
                width={640}
                height={820}
                priority
                className="h-auto w-full object-cover md:aspect-[4/5]"
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 420px, 90vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECH STACK GRID (hero-consistent, glass tiles) */}
      <section className="mx-auto mt-10 md:mt-12 max-w-[1200px]">
        <motion.h2
          {...fadeUp(0.05)}
          className="mb-6 text-center text-[22px] font-semibold text-neutral-900 dark:text-white"
        >
          My Tech Stack
        </motion.h2>

        <motion.div
          {...fadeUp(0.1)}
          className="
            grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6
            gap-4 sm:gap-5 md:gap-6
          "
        >
          {techIcons.map((tech, i) => (
            <motion.div
              key={typeof tech.name === "string" ? tech.name : `tech-${i}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: i * 0.02 }}
              className="
                group flex w-full flex-col items-center justify-center
                rounded-xl border border-neutral-200 bg-white/80 p-4 text-center shadow-sm
                ring-1 ring-black/5 backdrop-blur
                transition-all duration-300 hover:scale-105 hover:border-brand/40 hover:shadow-md
                dark:border-white/10 dark:bg-white/5 dark:ring-white/10
              "
              aria-label={typeof tech.name === "string" ? tech.name : undefined}
            >
              <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {tech.icon}
              </div>
              <span className="mt-2 text-sm text-neutral-600 dark:text-white/70">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
