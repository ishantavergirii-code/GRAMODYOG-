"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MENU_LINKS } from "./menu-links";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // Close drawer when navigating; omit onClose from deps to avoid spurious closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-lg text-xl leading-none text-zinc-600 hover:bg-zinc-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-xl px-4 py-3 text-base font-medium text-zinc-800 hover:bg-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
