// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
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
         Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">Eng Abdalla</span>

        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          A passionate fullstack developer crafting modern web apps using
          <br />
          Next.js, TypeScript, Tailwind CSS & more.
        </p>

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
