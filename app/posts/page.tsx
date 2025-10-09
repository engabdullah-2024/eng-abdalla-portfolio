// app/posts/page.tsx
'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  slug: string;
  publishedAt: Date;
};

function formatDate(d: Date | string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return String(d);
  }
}

function readingTime(text: string) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

// Keep in sync with next.config.js images.domains
const ALLOWED_HOSTS = new Set([
  'images.unsplash.com',
  'testrigor.com',
  'media2.dev.to',
  'dev.to',
  'encrypted-tbn0.gstatic.com',
  'res.cloudinary.com',
  'cdn.jsdelivr.net',
  'i.imgur.com',
  'raw.githubusercontent.com',
]);

const FALLBACK_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
       <rect width="100%" height="100%" fill="#e5e7eb"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="24">No preview</text>
     </svg>`
  );

function safeImageSrc(src: string): string {
  try {
    const u = new URL(src);
    return ALLOWED_HOSTS.has(u.hostname) ? src : FALLBACK_DATA_URL;
  } catch {
    return FALLBACK_DATA_URL;
  }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/posts', { cache: 'no-store' });
        const data = await res.json();
        if (data?.ok) setPosts(data.posts as Post[]);
        else setPosts([]);
      } catch {
        setPosts([]);
      }
    })();
  }, []);

  const items = useMemo(() => posts ?? [], [posts]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
          The Blog
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          Practical articles & tutorials by <span className="font-medium">Eng Abdalla</span>.
        </p>
      </header>

      {/* Loading skeleton */}
      {posts === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full animate-pulse bg-muted/50" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-32 animate-pulse rounded bg-muted/60" />
                <div className="h-6 w-4/5 animate-pulse rounded bg-muted/60" />
                <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-muted/60" />
                <div className="h-9 w-28 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <p className="text-muted-foreground">No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, idx) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(idx * 0.03, 0.18) }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-muted-foreground/10"
              style={{ minHeight: 420 }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={safeImageSrc(p.imageUrl)}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  placeholder="blur"
                  blurDataURL={FALLBACK_DATA_URL}
                />
                <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md ring-1 ring-border">
                  {readingTime(p.description)} min read
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{p.author}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={new Date(p.publishedAt).toISOString()}>
                    {formatDate(p.publishedAt)}
                  </time>
                </div>

                <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
                  <Link href={`/posts/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-auto pt-4">
                  <Link
                    href={`/posts/${p.slug}`}
                    className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Read more about ${p.title}`}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </main>
  );
}
