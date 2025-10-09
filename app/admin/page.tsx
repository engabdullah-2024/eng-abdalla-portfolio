"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

type Me = { name: string; email: string; role: "admin" };
type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  slug: string;
  publishedAt: string;
};

type FormState = {
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  slug: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try { return String(err); } catch { return "Unknown error"; }
}

export default function AdminDashboard() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [meError, setMeError] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // create
  const [createForm, setCreateForm] = useState<FormState>({
    title: "", description: "", imageUrl: "", author: "", slug: "",
  });
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const editingPost = useMemo(() => posts.find(p => p.slug === editSlug) ?? null, [posts, editSlug]);
  const [editForm, setEditForm] = useState<Partial<FormState>>({});

  const fetchMe = useCallback(async () => {
    setMeError(null);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const m = data.admin as { name: string; email: string; role: "admin" };
      setMe(m);
      // default author to admin name
      setCreateForm(f => ({ ...f, author: m.name }));
    } catch (err) {
      setMeError(getErrorMessage(err));
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setPosts(data.posts as Post[]);
    } catch (err) {
      setStatus(`Failed to load posts: ${getErrorMessage(err)}`);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
    void fetchPosts();
  }, [fetchMe, fetchPosts]);

  // If not authenticated, bounce to login
  useEffect(() => {
    if (meError) {
      router.replace("/admin/login");
    }
  }, [meError, router]);

  // ---- handlers
  const onCreateChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCreateForm(prev => ({ ...prev, [name]: value }));
    },
    [],
  );

  const onCreate = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setStatus(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // auth cookie checked server-side
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStatus("✅ Post created");
      setCreateForm(f => ({ ...f, title: "", description: "", imageUrl: "", slug: "" }));
      // refresh list
      await fetchPosts();
    } catch (err) {
      setStatus(`❌ ${getErrorMessage(err)}`);
    } finally {
      setCreating(false);
    }
  }, [createForm, fetchPosts]);

  const openEdit = useCallback((slug: string) => {
    setEditSlug(slug);
    const p = posts.find(x => x.slug === slug);
    setEditForm(p ? {
      title: p.title, description: p.description, imageUrl: p.imageUrl, author: p.author, slug: p.slug,
    } : {});
    setEditOpen(true);
  }, [posts]);

  const onEditChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditForm(prev => ({ ...prev, [name]: value }));
    }, [],
  );

  const onSaveEdit = useCallback(async () => {
    if (!editSlug) return;
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(editSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setEditOpen(false);
      setStatus("✅ Post updated");
      await fetchPosts();
    } catch (err) {
      setStatus(`❌ ${getErrorMessage(err)}`);
    }
  }, [editForm, editSlug, fetchPosts]);

  const onDelete = useCallback(async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStatus("✅ Post deleted");
      await fetchPosts();
    } catch (err) {
      setStatus(`❌ ${getErrorMessage(err)}`);
    }
  }, [fetchPosts]);

  // ✅ Logout -> redirect to login
  const [loggingOut, setLoggingOut] = useState(false);
  const onLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push("/admin/login");
    } catch (err) {
      // optional: show a toast/error state
      // eslint-disable-next-line no-console
      console.error("Logout failed:", err);
      router.push("/admin/login"); // force navigation anyway
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {me ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, <span className="font-medium">{me.name}</span> · Role:{" "}
              <span className="font-medium">{me.role}</span>
            </p>
          ) : meError ? (
            <p className="mt-1 text-sm text-red-600">
              Not logged in. <a className="underline" href="/admin/login">Go to Login</a>
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Loading profile…</p>
          )}
        </div>

        {/* Replaced form with a safe client logout */}
        <Button variant="outline" onClick={() => void onLogout()} disabled={loggingOut}>
          {loggingOut ? "Logging out…" : "Logout"}
        </Button>
      </div>

      {/* Create */}
      <Card className="mb-10 p-5">
        <h2 className="mb-4 text-xl font-semibold">Create new post</h2>
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input name="title" value={createForm.title} onChange={onCreateChange} required />
          </div>

          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <Input name="slug" value={createForm.slug} onChange={onCreateChange} placeholder="my-first-post" required />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Image URL</label>
            <Input name="imageUrl" value={createForm.imageUrl} onChange={onCreateChange} placeholder="https://…" required />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea name="description" value={createForm.description} onChange={onCreateChange} rows={5} required />
          </div>

          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium">Author</label>
            <Input name="author" value={createForm.author} onChange={onCreateChange} required />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={creating} className="w-full md:w-auto">
              {creating ? "Creating…" : "Create Post"}
            </Button>
          </div>
        </form>
        {status && (
          <p className={`mt-3 text-sm ${status.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </Card>

      {/* Posts list */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All posts</h2>
        <span className="text-sm text-muted-foreground">{loadingList ? "Loading…" : `${posts.length} item(s)`}</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {posts.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-24 w-24 flex-none rounded-xl object-cover ring-1 ring-black/5"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="truncate text-lg font-semibold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {p.author} · {new Date(p.publishedAt).toLocaleString()} ·{" "}
                      <span className="font-mono">{p.slug}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-7">{p.description}</p>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(p.slug)}>Edit</Button>
                  <Button variant="destructive" onClick={() => void onDelete(p.slug)}>Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>

          {editingPost ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <Input name="title" defaultValue={editingPost.title} onChange={onEditChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Slug</label>
                <Input name="slug" defaultValue={editingPost.slug} onChange={onEditChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Image URL</label>
                <Input name="imageUrl" defaultValue={editingPost.imageUrl} onChange={onEditChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Author</label>
                <Input name="author" defaultValue={editingPost.author} onChange={onEditChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <Textarea name="description" defaultValue={editingPost.description} onChange={onEditChange} rows={5} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => void onSaveEdit()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
