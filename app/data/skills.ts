import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiMongodb,
  SiReact,
  SiFramer,
  SiExpress,
  SiGithub,
  SiJavascript,
} from "react-icons/si";

export interface Skill {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string; // Tailwind color class for icon
}

export const skills: Skill[] = [
  { name: "Next.js", Icon: SiNextdotjs, color: "text-black dark:text-white" },
  { name: "TypeScript", Icon: SiTypescript, color: "text-blue-600" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "text-cyan-500" },
  { name: "Prisma", Icon: SiPrisma, color: "text-indigo-600" },
  { name: "MongoDB", Icon: SiMongodb, color: "text-green-600" },
  { name: "React", Icon: SiReact, color: "text-sky-500" },
  { name: "Framer Motion", Icon: SiFramer, color: "text-pink-600" },
  { name: "Express.js", Icon: SiExpress, color: "text-gray-700 dark:text-gray-300" },
  { name: "GitHub", Icon: SiGithub, color: "text-black dark:text-white" },
  { name: "JavaScript", Icon: SiJavascript, color: "text-yellow-400" },
];
