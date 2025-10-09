// app/posts/[slug]/page.tsx
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { MotionDiv } from "./_components/motion-div";
import ShareRail from "./_components/ShareRail";

export const runtime = "nodejs";
export const revalidate = 0;

/* ---------- Param normalization that works with both shapes ---------- */
type SlugParams = { slug: string };
type CtxEither =
  | { params: SlugParams }
  | { params: Promise<SlugParams> };

function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (v as any)?.then === "function";
}

async function resolveParams(ctx: unknown): Promise<SlugParams> {
  const c = ctx as Partial<CtxEither> | undefined;
  if (!c || !("params" in c)) throw new Error("Missing params");
  const p = (c as CtxEither).params;
  return isPromise(p) ? await p : p;
}
/* -------------------------------------------------------------------- */

function formatDate(d: Date | string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return String(d);
  }
}

function readingTime(text: string) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata(ctx: unknown) {
  const { slug } = await resolveParams(ctx);

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, description: true, imageUrl: true },
  });

  if (!post) return { title: "Post not found" };

  const title = `${post.title} — Eng Abdalla Blog`;
  const description = post.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title,
      description,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function PostPage(ctx: unknown) {
  const { slug } = await resolveParams(ctx);

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();

  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { publishedAt: { lt: post.publishedAt } },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: { publishedAt: { gt: post.publishedAt } },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  const moreFromAuthor = await prisma.post.findMany({
    where: { author: post.author, slug: { not: post.slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, imageUrl: true, publishedAt: true },
  });

  const minutes = readingTime(post.description);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/posts/${post.slug}`;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" className="pl-2">
          <Link href="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to posts
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="relative aspect-[16/6] w-full">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {post.author}
              </Badge>
              <span aria-hidden>•</span>
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden>•</span>
              <span>{minutes} min read</span>
            </div>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content + share rail */}
      <section className="relative mt-10 grid grid-cols-1 lg:grid-cols-[1fr,260px] lg:gap-10">
        {/* Article */}
        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
        >
          <article className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap leading-7">{post.description}</p>
          </article>

          <Separator className="my-8" />

          {/* Prev / Next */}
          <nav className="grid gap-3 sm:grid-cols-2">
            <div className="flex min-h-[68px] items-center justify-start rounded-xl border p-3">
              {prevPost ? (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  aria-label={`Previous: ${prevPost.title}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="line-clamp-1">{prevPost.title}</span>
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">No previous post</span>
              )}
            </div>
            <div className="flex min-h-[68px] items-center justify-end rounded-xl border p-3">
              {nextPost ? (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  aria-label={`Next: ${nextPost.title}`}
                >
                  <span className="line-clamp-1">{nextPost.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">No next post</span>
              )}
            </div>
          </nav>
        </MotionDiv>

        {/* Share rail — client component */}
        <aside className="mt-8 lg:mt-0">
          <div className="sticky top-24 space-y-4">
            <ShareRail url={shareUrl} title={post.title} />
            {moreFromAuthor.length > 0 && (
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <h3 className="text-sm font-medium">More from {post.author}</h3>
                <ul className="mt-3 space-y-3">
                  {moreFromAuthor.map((m) => (
                    <li key={m.id} className="group">
                      <Link href={`/posts/${m.slug}`} className="block" aria-label={m.title}>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 overflow-hidden rounded-md border">
                            {m.imageUrl ? (
                              <Image
                                src={m.imageUrl}
                                alt={m.title}
                                fill
                                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline">
                              {m.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {formatDate(m.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
