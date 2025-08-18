"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-10 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          My Best Projects
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          A showcase of my professional work using modern technologies and frameworks.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/images/pro.png"
            alt="Next.js Logo"
            width={80}
            height={80}
            className="dark:invert"
            priority
          />
        </div>
      </motion.div>

      {/* Projects Grid */}
      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ title, description, tech, liveLink, githubLink, image }) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-muted rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-background"
          >
            {/* Project Image */}
            <div className="relative w-full h-48">
              <Image
                src={image}
                alt={`${title} screenshot`}
                fill
                className="object-cover dark:border-4 border-white"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {description}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {liveLink && (
                  <Link href={liveLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="flex items-center gap-1">
                      Live Demo
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {githubLink && (
                  <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="flex items-center gap-1">
                      GitHub
                      <Github className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
