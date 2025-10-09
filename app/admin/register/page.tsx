"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    setMsg(data.ok ? "Registered & logged in" : data.error || `HTTP ${res.status}`);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold">Admin – Register</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <Input placeholder="Password (min 8)" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <Button type="submit" className="w-full">Register</Button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </main>
  );
}
