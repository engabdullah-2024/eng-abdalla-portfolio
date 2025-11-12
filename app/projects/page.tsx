"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type MotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../data/projects";

type Project = {
  title: string;
  description: string;
  tech: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  image: string;
};

const GRID_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E\")";

const LINEAR_BEAMS =
  "linear-gradient(115deg, rgba(56,189,248,0.08), transparent 45%), linear-gradient(245deg, rgba(99,102,241,0.08), transparent 40%)";

const fadeInUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function ProjectsPage() {
  const data = projects as Project[];

  return (
    <main className="relative isolate min-h-[100svh] px-4 py-20 sm:px-8 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 opacity-70 dark:opacity-80"
        style={{ backgroundImage: LINEAR_BEAMS }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35] dark:opacity-[0.25] [mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)] [-webkit-mask-image:radial-gradient(ellipse_120%_80%_at_50%_20%,black,transparent)]"
        style={{ backgroundImage: GRID_DATA_URL, backgroundSize: "32px 32px", backgroundPosition: "center" }}
      />
      <div aria-hidden="true" className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="mx-auto w-full max-w-[1200px]">
        <motion.header
          {...fadeInUp(0)}
          className="mb-12 md:mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/60 px-3 py-1 text-xs text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Selected Work
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white sm:text-5xl">
            My Best Projects
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-neutral-600 dark:text-white/70 sm:text-lg">
            A curated selection built with modern stacks and production-grade practices.
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

        <section
          aria-label="Projects"
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {data.map(({ title, description, tech, liveLink, githubLink, image }) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="
                group relative overflow-hidden
                rounded-[22px]
                border border-neutral-200 bg-white/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]
                ring-1 ring-black/5 backdrop-blur
                transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
                dark:border-white/10 dark:bg-white/5 dark:ring-white/10
                focus-within:outline-none focus-within:ring-2 focus-within:ring-brand/40
              "
              tabIndex={-1}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand/25 to-transparent opacity-60"
              />
              <div className="relative h-48 w-full sm:h-52">
                <Image
                  src={image}
                  alt={`${title} screenshot`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>

              <div className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold leading-tight text-neutral-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/70">
                  {description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span
                      key={`${title}-${t}`}
                      className="
                        rounded-full border border-neutral-200 bg-white/70 px-3 py-1
                        text-xs font-medium text-neutral-600
                        transition-colors
                        group-hover:border-brand/40 group-hover:text-neutral-800
                        dark:border-white/10 dark:bg-white/10 dark:text-white/70
                      "
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {liveLink ? (
                    <Button asChild variant="outline" className="gap-1 border-neutral-300 text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                      <Link href={liveLink} target="_blank" rel="noopener noreferrer">
                        Live Demo <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                  {githubLink ? (
                    <Button asChild variant="outline" className="gap-1 border-neutral-300 text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                      <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                        GitHub <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 translate-y-10 bg-gradient-to-t from-brand/25 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-transparent transition-all duration-300 group-hover:ring-brand/20"
              />
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
