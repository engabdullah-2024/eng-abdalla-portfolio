// app/blog/[slug]/page.tsx

'use client';

import posts from '@/data/posts.json';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getReadingTime } from '@/lib/readingTime';
import { ArrowLeft } from 'lucide-react';

type PageProps = {
  params: {
    slug: string;
  };
};

// ✅ If using SSG (Static Site Generation)
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) notFound();

  const readingTime = getReadingTime(post.content);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-gray-800 dark:text-gray-200">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Blog</span>
        </Link>
      </div>

      <article className="bg-white dark:bg-gray-900 rounded-xl shadow-md ring-1 ring-gray-100 dark:ring-gray-700 overflow-hidden transition">
        <div className="relative w-full h-64 sm:h-80 md:h-[400px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>
              {new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className="italic">{post.author}</span>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 mb-6">
            <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
              This article walks you through all key steps with clarity and purpose.
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-blue max-w-none whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </main>
  );
}
