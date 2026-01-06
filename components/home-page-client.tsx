"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AtAGlance } from "@/components/at-a-glance";
import { CategorySection } from "@/components/category-section";
import { HeroSection } from "@/components/hero-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CuratedHomepage } from "@/lib/types";

export function HomePageClient() {
  const [curatedData, setCuratedData] = useState<CuratedHomepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/curated");
        const data = await res.json();
        if (data.error) {
          setError(true);
        } else if (data.data) {
          setCuratedData(data.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-3xl font-serif font-bold text-foreground">
              Obluda
            </a>
            <nav className="flex items-center gap-8">
              <a
                href="/archive"
                className="text-sm tracking-wide uppercase hover:text-primary transition-colors"
              >
                Archive
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading latest news...</span>
          </div>
        )}

        {error && !loading && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load the latest news. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {curatedData && !loading && !error && (
          <>
            <HeroSection data={curatedData.hero_section} />

            <div>
              <AtAGlance items={curatedData.at_a_glance} />
            </div>

            <div className="mt-20 space-y-16">
              {curatedData.categorized_sections?.map((section, index) => (
                <CategorySection key={index} section={section} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Obluda. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
