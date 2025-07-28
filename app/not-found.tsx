"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <h1 className="text-6xl font-bold tracking-tight text-foreground mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      {/* A&O - Actions & Options */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/">
          <Button variant="default" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <Link href="/contact">
          <Button variant="secondary">Contact Support</Button>
        </Link>
      </div>
    </main>
  );
}
