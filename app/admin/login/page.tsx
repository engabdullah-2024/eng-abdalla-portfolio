// ./app/admin/login/page.tsx
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type LoginResponse = {
  ok: boolean;
  error?: string;
};

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const isDisabled = useMemo(
    () => loading || email.trim().length === 0 || password.length === 0,
    [loading, email, password]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    if (isDisabled) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        cache: "no-store",
      });

      const data = (await res.json()) as LoginResponse;

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      router.push("/admin");
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Admin — Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={email.length > 0 ? undefined : true}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-invalid={password.length > 0 ? undefined : true}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isDisabled}
          aria-busy={loading}
          aria-disabled={isDisabled}
        >
          {loading ? "Logging in…" : "Login"}
        </Button>
      </form>

      {msg && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {msg}
        </p>
      )}
    </main>
  );
}
