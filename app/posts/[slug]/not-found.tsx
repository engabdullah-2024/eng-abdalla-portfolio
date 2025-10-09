// app/posts/[slug]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-3xl place-items-center px-6 py-16 text-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Post not found</h1>
        <p className="mt-2 text-muted-foreground">
          The article you’re looking for may have been moved or deleted.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/posts">Go back to posts</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
