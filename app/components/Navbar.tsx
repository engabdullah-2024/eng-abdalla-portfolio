"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  FolderOpen,
  Cpu,
  Mail,
} from "lucide-react";
import {ModeToggle} from "../components/ModeToggle";  // <-- Import ModeToggle

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", Icon: Home },
    { label: "About", href: "/about", Icon: User },
    { label: "Projects", href: "/projects", Icon: FolderOpen },
    { label: "Skills", href: "/skills", Icon: Cpu },
    { label: "Blog", href: "/blog", Icon: Cpu },
    { label: "Contact", href: "/contact", Icon: Mail },
    
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-4 sticky top-0 bg-background/90 backdrop-blur-md border-b border-muted z-50">
        <div className="flex space-x-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-lg font-medium px-2 py-1 rounded-md ${
                isActive(href)
                  ? "text-blue-600 font-semibold"
                  : "text-muted-foreground hover:text-blue-600"
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded" />
              )}
            </Link>
          ))}
        </div>

        {/* Mode toggle button */}
        <ModeToggle />
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-muted z-50 flex justify-around items-center py-2 shadow-t">
        {navLinks.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center text-xs font-semibold transition-colors ${
              isActive(href)
                ? "text-blue-600"
                : "text-muted-foreground hover:text-blue-600"
            }`}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon className="w-6 h-6 mb-1" />
            {label}
          </Link>
        ))}

        {/* Mode toggle button */}
        <ModeToggle />
      </nav>
    </>
  );
}
