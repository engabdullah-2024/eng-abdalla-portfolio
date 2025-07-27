"use client";

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

export default function AboutPage() {
  const techIcons = [
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
    <main className="min-h-screen py-20 px-6 sm:px-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 sm:w-40 sm:h-40 relative rounded-full overflow-hidden shadow-md"
          >
            <Image
              src="/iltire.jpg" // ✅ make sure to place your image in public/me.jpg
              alt="Eng Abdalla"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">
          About Me
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          I'm <span className="font-semibold">Eng Abdalla</span>, a senior full-stack
          developer crafting fast, scalable, and delightful web experiences with{" "}
          <strong>Next.js</strong>, <strong>TypeScript</strong>,{" "}
          <strong>Tailwind CSS</strong>, and <strong>MongoDB</strong>.
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-primary">
          My Tech Stack
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
          {techIcons.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {tech.icon}
              </div>
              <span className="mt-2 text-sm text-muted-foreground">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Resume */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center"
      >
        <Link href="/Eng-Abdalla-Resume.pdf" target="_blank">
          <Button
            size="lg"
            variant="default"
            className="text-base font-medium gap-2"
          >
            <Download className="h-5 w-5" />
            Download My Resume
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
