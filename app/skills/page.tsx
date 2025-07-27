"use client";

import { motion } from "framer-motion";
import { skills } from "../data/skills";

export default function SkillsPage() {
  return (
    <main className="min-h-screen py-20 px-6 sm:px-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">My Skills & Tools</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          A comprehensive list of technologies and tools I use to build scalable, modern web applications.
        </p>
      </motion.div>

      {/* Skills Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8"
      >
        {skills.map(({ name, Icon, color }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center p-4 bg-muted rounded-2xl shadow-sm cursor-default select-none"
          >
            <Icon className={`text-6xl ${color}`} aria-hidden="true" />
            <span className="mt-3 font-semibold text-base text-foreground">{name}</span>
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
