"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { MenuDrawer } from "./MenuDrawer";
import { SidebarNav } from "./SidebarNav";

export type AppShellVariant = "home" | "back";

type AppShellProps = {
  variant: AppShellVariant;
  title?: string;
  greetingName?: string;
  children: ReactNode;
  /** Extra column beside main on large screens (e.g. chat idea list) */
  sidePanel?: ReactNode;
};

function Hamburger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-zinc-100 lg:hidden"
      aria-label="Open menu"
    >
      <span className="block h-0.5 w-5 bg-zinc-800" />
      <span className="block h-0.5 w-5 bg-zinc-800" />
      <span className="block h-0.5 w-5 bg-zinc-800" />
    </button>
  );
}

export function AppShell({
  variant,
  title,
  greetingName,
  children,
  sidePanel,
}: AppShellProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white lg:block">
          <div className="border-b border-zinc-200 px-4 py-5">
            <Link href="/home" className="text-lg font-semibold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "Business Ideas"}
            </Link>
          </div>
          <SidebarNav />
        </aside>

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {variant === "back" ? (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="min-h-11 min-w-11 shrink-0 rounded-lg text-2xl leading-none hover:bg-zinc-100"
                    aria-label="Go back"
                  >
                    ←
                  </button>
                ) : (
                  <span className="min-w-[2.75rem] lg:hidden" />
                )}
                <div className="min-w-0 truncate">
                  {variant === "home" ? (
                    <h1 className="text-lg font-semibold md:text-xl">
                      hi, {greetingName ?? "there"}
                    </h1>
                  ) : (
                    <h1 className="truncate text-lg font-semibold md:text-xl">
                      {title}
                    </h1>
                  )}
                </div>
              </div>
              <Hamburger onClick={() => setMenuOpen(true)} />
            </div>
          </header>

          <div className="flex flex-1 flex-col lg:flex-row">
            {sidePanel ? (
              <div className="hidden border-b border-zinc-200 bg-white lg:block lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
                {sidePanel}
              </div>
            ) : null}
            <main className="flex flex-1 flex-col px-4 py-5 pb-24 md:px-6 lg:pb-8">
              {children}
            </main>
          </div>
        </div>
      </div>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
