"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_LINKS } from "./menu-links";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Menu
      </p>
      {MENU_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`min-h-11 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <div className="mt-8 pt-4 border-t border-zinc-100">
        <Link
          href="/settings"
          className="group block rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 transition hover:bg-emerald-100/60"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-900">
              n8n Live Webhook
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-emerald-700 truncate">
            localhost:5678
          </p>
        </Link>
      </div>
    </nav>
  );
}
