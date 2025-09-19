"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../data/projects";

// ---- Background assets (encoded / stable) ----
const GRID_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

const LINEAR_BEAMS =
  "linear-gradient(115deg, rgba(56,189,248,0.08), transparent 45%), linear-gradient(245deg, rgba(99,102,241,0.08), transparent 40%)";

// ---- Motion variants (as const to keep types/lint happy) ----
const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

export default function ProjectsPage() {
  return (
    <main
      className="
        relative isolate min-h-[100svh] px-4 py-24 sm:px-10
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
      {/* LAYER 2: SVG grid (masked to center) */}
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

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <motion.header
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={fadeInUp.transition}
          className="mb-16 text-center"
        >
          <span className="inline-block rounded-full border px-3 py-1 text-xs text-muted-foreground">
            Selected Work
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            My Best Projects
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            A curated selection built with modern stacks and production-ready practices.
          </p>
          <div className="mt-6 flex justify-center">
            <Image
              src="/images/pro.png"
              alt="Projects emblem"
              width={80}
              height={80}
              className="dark:invert"
              priority
            />
          </div>
        </motion.header>

        {/* Projects Grid */}
        <section
          aria-label="Projects"
          className="
            grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3
          "
        >
          {projects.map(({ title, description, tech, liveLink, githubLink, image }) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="
                group relative overflow-hidden rounded-2xl
                border border-white/20 bg-white/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)]
                ring-1 ring-black/5 backdrop-blur-md
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                dark:border-white/10 dark:bg-white/5 dark:ring-white/10
              "
            >
              {/* Soft top gradient accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent opacity-60"
              />

              {/* Project Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={image}
                  alt={`${title} screenshot`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold leading-tight">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                {/* Tech stack badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {tech.map((t: string) => (
                    <span
                      key={`${title}-${t}`}
                      className="rounded-full border border-transparent bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {liveLink ? (
                    <Button asChild variant="outline" className="gap-1">
                      <Link href={liveLink} target="_blank" rel="noopener noreferrer">
                        Live Demo <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                  {githubLink ? (
                    <Button asChild variant="outline" className="gap-1">
                      <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                        GitHub <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Subtle bottom glow when hovering */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 translate-y-10 bg-gradient-to-t from-primary/25 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
