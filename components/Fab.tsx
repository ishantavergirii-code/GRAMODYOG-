"use client";

import Link from "next/link";

export function Fab() {
  return (
    <Link
      href="/new-chat"
      className="fixed bottom-6 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-3xl font-light text-white shadow-lg transition hover:bg-zinc-800 md:right-[max(1rem,calc((100vw-72rem)/2+1.5rem))]"
      aria-label="Create new chat"
    >
      +
    </Link>
  );
}
