'use client';

import { useState } from 'react';
import postsData from '../data/posts.json';
import Link from 'next/link';
import Image from 'next/image';
import { getReadingTime } from '@/lib/readingTime';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredPosts = postsData
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <main className="max-w-6xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        My Portfolio Blog Posts
      </h1>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="w-full sm:w-48 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Blog List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const readingTime = getReadingTime(post.content);

          return (
            <li
              key={post.slug}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition dark:border-gray-700 dark:bg-gray-900"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()} • {post.author} • {readingTime}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Read More →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No blog posts found.
        </p>
      )}
    </main>
  );
}
