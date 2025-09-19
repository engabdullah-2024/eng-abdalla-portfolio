// app/about/page.tsx
"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

// Stable, typed variants
const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

// Pre-encoded assets in constants
const GRID_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

const LINEAR_BEAMS =
  "linear-gradient(115deg, rgba(56,189,248,0.08), transparent 45%), linear-gradient(245deg, rgba(99,102,241,0.08), transparent 40%)";

// ✅ Fix: use ReactNode instead of JSX.Element
type Tech = { icon: ReactNode; name: string };

export default function AboutPage() {
  const techIcons: Tech[] = [
    { icon: <FaReact className="text-sky-500" />, name: "React" },
    { icon: <SiNextdotjs className="text-black dark:text-white" />, name: "Next.js" },
    { icon: <SiTypescript className="text-blue-600" />, name: "TypeScript" },
    { icon: <SiJavascript className="text-yellow-400" />, name: "JavaScript" },
    { icon: <SiTailwindcss className="text-cyan-500" />, name: "Tailwind CSS" },
    { icon: <FaNodeJs className="text-green-600" />, name: "Node.js" },
    { icon: <SiExpress className="text-gray-700 dark:text-gray-300" />, name: "Express.js" },
    { icon: <SiMongodb className="text-green-500" />, name: "MongoDB" },
    { icon: <FaGithub className="text-black dark:text-white" />, name: "GitHub" },
    { icon: <FaGitAlt className="text-red-500" />, name: "Git" },
    { icon: <FaHtml5 className="text-orange-600" />, name: "HTML5" },
    { icon: <FaCss3Alt className="text-blue-600" />, name: "CSS3" },
  ];

  return (
    <main
      className="
        relative isolate min-h-[100svh] px-6 py-20 sm:px-10
        bg-gradient-to-b from-slate-50 via-white to-slate-100
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      {/* LAYER 1: Linear gradient beams */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 opacity-70 dark:opacity-80"
        style={{ backgroundImage: LINEAR_BEAMS }}
      />
      {/* LAYER 2: SVG grid (masked) */}
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
      {/* LAYER 3: Blurred color orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
      />

      {/* BIO */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
        className="
          relative mx-auto mb-14 max-w-5xl rounded-3xl border
          border-white/20 bg-white/40 p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.25)]
          backdrop-blur-xl dark:border-white/10 dark:bg-white/5
        "
      >
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-1 ring-black/5 md:h-36 md:w-36">
            <Image
              src="/eng.jpg"
              alt="Eng Abdalla"
              fill
              sizes="(max-width: 768px) 8rem, 9rem"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">
              About Me
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I&apos;m <span className="font-semibold">Eng Abdalla</span>, a full-stack developer
              focused on clean architecture, strong typing, and beautiful UX. I build fast, scalable
              apps with <strong>Next.js</strong>, <strong>TypeScript</strong>,{" "}
              <strong>Tailwind CSS</strong>, <strong>MongoDB</strong>, and the MERN ecosystem.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="gap-2">
                <Link href="/abdalla.pdf" target="_blank" rel="noreferrer" prefetch>
                  <Download className="h-5 w-5" />
                  Download My Resume
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TECH STACK */}
      <motion.section
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.12 }}
        className="mx-auto mb-4 max-w-6xl"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">My Tech Stack</h2>
        <div className="grid grid-cols-3 justify-items-center gap-6 sm:grid-cols-4 md:grid-cols-6">
          {techIcons.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: i * 0.02 }}
              className="
                group flex w-full max-w-[120px] flex-col items-center rounded-xl
                border border-transparent bg-white/40 p-4 text-center shadow-sm
                ring-1 ring-black/5 backdrop-blur
                transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-white/60
                dark:bg-white/5 dark:ring-white/10
              "
              aria-label={tech.name}
            >
              <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {tech.icon}
              </div>
              <span className="mt-2 text-sm text-muted-foreground">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
