"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-20 sm:px-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">My Best Projects</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          Showcasing my expertise in modern web development using robust technologies.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ title, description, tech, liveLink, githubLink }) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-muted rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow bg-background"
          >
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{description}</p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.map((t) => (
                <span
                  key={t}
                  className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {liveLink && (
                <Link href={liveLink} target="_blank" rel="noopener noreferrer" passHref>
                  <Button variant="outline" className="flex items-center gap-1">
                    Live Demo <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              {githubLink && (
                <Link href={githubLink} target="_blank" rel="noopener noreferrer" passHref>
                  <Button variant="outline" className="flex items-center gap-1">
                    GitHub <Github className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
