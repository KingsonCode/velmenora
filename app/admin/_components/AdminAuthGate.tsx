"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AuthState = "checking" | "authenticated" | "unauthorized";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>("checking");

  useEffect(() => {
    let active = true;

    async function check() {
      const res = await fetch("/api/admin/session/me", {
        cache: "no-store",
      });

      const json = await res.json().catch(() => null);

      if (!active) return;

      if (res.ok && json?.authenticated) {
        setState("authenticated");
      } else {
        setState("unauthorized");
      }
    }

    check();

    return () => {
      active = false;
    };
  }, []);

  if (state === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Checking admin session...
      </main>
    );
  }

  if (state === "unauthorized") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-red-300">
            Unauthorized
          </p>
          <h1 className="mt-3 text-3xl font-black">Admin Access Required</h1>
          <p className="mt-3 text-sm text-slate-400">
            Sign in before opening the affiliate admin dashboard.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950"
          >
            Go to Admin Login
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
