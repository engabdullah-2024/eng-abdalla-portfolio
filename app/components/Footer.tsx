import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-muted mt-20 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left side */}
        <p className="text-muted-foreground text-sm select-none">
          &copy; {currentYear} Eng Abdalla. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex space-x-6 text-muted-foreground">
          <Link
            href="mailto:your.email@example.com"
            aria-label="Send Email"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Mail size={24} />
          </Link>
          <Link
            href="https://github.com/engabdullah-2024"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="hover:text-gray-900 dark:hover:text-white transition"
          >
            <Github size={24} />
          </Link>
          <Link
            href="https://linkedin.com/in/engabdalla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="hover:text-blue-700 transition"
          >
            <Linkedin size={24} />
          </Link>
          <Link
            href="https://twitter.com/engabdalla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="hover:text-sky-500 transition"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="tel:+252613169435"
            aria-label="Phone Number"
            className="hover:text-green-600 transition"
          >
            <Phone size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
