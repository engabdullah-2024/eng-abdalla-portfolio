// app/posts/[slug]/loading.tsx
export default function LoadingPost() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10">
      <div className="mb-6 h-9 w-40 animate-pulse rounded-md bg-muted" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative aspect-[16/8] w-full animate-pulse bg-muted" />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}
