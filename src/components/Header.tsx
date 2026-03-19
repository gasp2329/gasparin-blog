"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { PenLine, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-2xl px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="group">
          <h1 className="text-[1.0625rem] font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
            The Gasparin Blog
          </h1>
          <p className="text-xs text-muted mt-0">Ideas, thoughts & things worth sharing</p>
        </Link>

        <nav className="flex items-center gap-4">
          {session?.user && (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-1.5 text-sm bg-accent text-white px-2.5 py-1 rounded-md hover:bg-accent-hover transition-colors"
              >
                <PenLine size={15} />
                <span className="hidden sm:inline">Write</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <LogOut size={15} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
