"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    href: "/admin/funded/affiliates/applications",
    label: "Applications",
  },
  {
    href: "/admin/funded/affiliates/commissions",
    label: "Commissions",
  },
  {
    href: "/admin/funded/affiliates/payouts",
    label: "Payouts",
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
            Velmenora Admin Console
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Manage affiliate applications, commission reviews, and payout operations.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950"
                    : "rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                }
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-950/40"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
