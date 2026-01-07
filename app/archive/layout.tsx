"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepageTab = pathname.startsWith("/archive/homepage") || pathname === "/archive";
  const isNewsTab = pathname.startsWith("/archive/news");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="text-3xl font-serif font-bold text-foreground"
            >
              Obluda
            </a>
            <nav className="flex items-center gap-8">
              <a
                href="/archive"
                className="text-sm tracking-wide uppercase text-primary"
              >
                Archive
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-serif font-bold mb-4 text-balance">
            Archive
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse historical curated homepages and search our complete news
            database
          </p>
        </div>

        <div className="mt-8">
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-8">
            <Link
              href="/archive/homepage"
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isHomepageTab
                  ? "bg-background text-foreground shadow"
                  : "hover:bg-background/50 hover:text-foreground",
              )}
            >
              Curated Homepages
            </Link>
            <Link
              href="/archive/news"
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isNewsTab
                  ? "bg-background text-foreground shadow"
                  : "hover:bg-background/50 hover:text-foreground",
              )}
            >
              All News Records
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
