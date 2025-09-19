"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Home, User, FolderOpen, Cpu, Mail } from "lucide-react";
import { ModeToggle } from "../components/ModeToggle";

type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "About", href: "/about", Icon: User },
  { label: "Projects", href: "/projects", Icon: FolderOpen },
  { label: "Skills", href: "/skills", Icon: Cpu },
  { label: "Contact", href: "/contact", Icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* ===== Desktop Header (sticky) ===== */}
      <header
        className="
          sticky top-0 z-50 w-full
          border-b border-white/20 bg-background/60 backdrop-blur-xl
          dark:border-white/10
        "
        role="banner"
      >
        {/* Subtle gradient top border accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none h-0.5 w-full bg-gradient-to-r from-indigo-500/40 via-cyan-400/40 to-indigo-500/40"
        />

        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          aria-label="Primary"
          role="navigation"
        >
          {/* Brand */}
          <Link
            href="/"
            className="select-none text-xl font-bold tracking-tight"
            aria-label="Go to home"
            prefetch
          >
            Eng <span className="text-[#00a1f5]">Abdalla</span>
          </Link>

          {/* Links */}
          <ul className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch
                    className={`
                      relative rounded-md px-3 py-2 text-sm font-medium transition
                      ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                    `}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                    {/* Active pill indicator */}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-1 -bottom-1 block h-[3px] rounded-full bg-primary/70"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right controls */}
          <div className="ml-3 flex items-center gap-2">
            <ModeToggle />
          </div>
        </nav>
      </header>

      {/* ===== Mobile Dock (bottom) ===== */}
      <nav
        className="
          fixed inset-x-0 bottom-0 z-50 flex items-center justify-around
          border-t border-white/20 bg-background/80 backdrop-blur-xl
          py-2 pb-[calc(env(safe-area-inset-bottom,0)+0.5rem)]
          md:hidden
          dark:border-white/10
        "
        aria-label="Primary mobile"
        role="navigation"
      >
        {NAV_LINKS.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                group flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium
                ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`
                  inline-flex h-9 w-9 items-center justify-center rounded-xl border
                  transition
                  ${active ? "border-primary/40 bg-primary/10" : "border-transparent bg-background/40"}
                `}
              >
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </Link>
          );
        })}

        {/* Theme toggle kept at end for thumb reach */}
        <div className="ml-1 flex items-center">
          <ModeToggle />
        </div>
      </nav>
    </>
  );
}
