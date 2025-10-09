"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  title: string;
  className?: string;
};

export default function ShareRail({ url, title, className }: Props) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      // You can replace with a toast if you use one
      alert("Link copied!");
    } catch {
      alert("Copy failed");
    }
  }

  return (
    <div className={className}>
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-medium">Share</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button asChild size="sm" variant="outline">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
              )}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </a>
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            Copy link
          </Button>
        </div>
      </div>
    </div>
  );
}
