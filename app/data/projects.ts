// /data/projects.ts

export interface Project {
  title: string;
  description: string;
  tech: string[];
  liveLink?: string;
  githubLink?: string;
  image: string; // ✅ Add image field
}

export const projects: Project[] = [
  {
    title: "MogTax Easy Pay",
    description:
      "Scalable property management app built with React.js, Express, Tailwind CSS, Shadcn UI,MongoDB, and jwt. Designed for real-world data modeling and authentication flows.",
    tech: [
      "React.js",
      "Express",
      "Tailwind CSS",
      "Shadcn UI",
      "Node.js",
      "MongoDB",
      "JWt",
    ],
    liveLink: "#", // 🔁 Replace with real link
    githubLink: "https://github.com/engabdullah-2024/real-state-management",
    image: "/images/mog.png",
  },
  {
    title: "Portfolio",
  description:
    "A sleek, modern portfolio built with Next.js, TypeScript, and Shadcn UI, showcasing responsive design, clean code, and seamless user experience.",
  tech: [
    "Next.js",
    "TypeScript",
    "Shadcn UI",
    "Framer-Motion"
    ],
    liveLink: "https://eng-abdalla-portfolio.vercel.app/", // replace with your live portfolio URL
  githubLink: "https://github.com/engabdullah-2024/portfolio", // replace if needed
  image: "/images/portfolio.PNG",
  },
  {
    title: "E-commerce",
    description:
      "Robust full-stack MERN e-commerce platform with user authentication, admin panel, product CRUD operations, and responsive UI.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    liveLink: "#",
    githubLink: "https://github.com/engabdullah-2024/e-commerce",
    image: "/images/eco.PNG",
  },
{
  title: "Calculator",
  description:
    "A sleek and responsive calculator app built with vanilla JavaScript and styled using Tailwind CSS for a clean user experience.",
  tech: ["JavaScript", "Tailwind CSS"],
  liveLink: "https://calculator-app-chi-vert.vercel.app/", // replace with actual live link if available
  githubLink: "https://github.com/engabdullah-2024/calculator", // update if different
  image: "/images/cal.PNG",
},
{
  title: "Cimilo Tracker",
  description:
    "A sleek and responsive mileage tracker app built with vanilla JavaScript and styled using Tailwind CSS, designed to help users efficiently log and monitor their trips.",
  tech: ["JavaScript", "Tailwind CSS"],
  liveLink: "https://calculator-app-chi-vert.vercel.app/", // Update if you have a more relevant URL
  githubLink: "https://github.com/engabdullah-2024/calculator", // Update if different repo
  image: "/images/cimilo.PNG",
},
{
  title: "Dugsi Hub",
  description:
    "A free platform offering Grade 12 students access to downloadable exam PDFs, quizzes, and educational resources — designed with Next.js, TypeScript, Tailwind CSS, Shadcn UI, and Framer Motion for a seamless user experience.",
  tech: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "Framer Motion"],
  liveLink: "https://dugsi-hub-soma.vercel.app/", // Replace with actual live URL
  githubLink: "https://github.com/engabdullah-2024/dugsi-hub", // Replace with actual repo if different
  image: "/images/dugsi.PNG", // Replace with relevant image path
},



];
