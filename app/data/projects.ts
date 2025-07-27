export interface Project {
  title: string;
  description: string;
  tech: string[];
  liveLink?: string;
  githubLink?: string;
}

export const projects: Project[] = [
  {
    title: "Real State Management",
    description:
      "Scalable property management app built with Next.js, TypeScript, Tailwind, Shadcn, Prisma, MongoDB, and NextAuth.",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Shadcn",
      "Prisma",
      "MongoDB",
      "NextAuth",
    ],
    liveLink: "#", // replace with actual URL
    githubLink: "https://github.com/engabdullah-2024/real-state-management",
  },
  {
    title: "Saasify",
    description:
      "SaaS platform leveraging Next.js, TypeScript, Tailwind, Shadcn, Prisma, MongoDB, and NextAuth.",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Shadcn",
      "Prisma",
      "MongoDB",
      "NextAuth",
    ],
    liveLink: "#",
    githubLink: "https://github.com/engabdullah-2024/saasify",
  },
  {
    title: "E-commerce",
    description:
      "Full MERN stack e-commerce app featuring user authentication, product management, and responsive design.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    liveLink: "#",
    githubLink: "https://github.com/engabdullah-2024/e-commerce",
  },
];
