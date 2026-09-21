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
    </nav>
  );
}
