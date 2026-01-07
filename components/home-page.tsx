"use client";

import { AtAGlance } from "@/components/at-a-glance";
import { CategorySection } from "@/components/category-section";
import { HeroSection } from "@/components/hero-section";
import type { CuratedHomepage } from "@/lib/types";

interface HomePageProps {
  curatedData: CuratedHomepage;
}

export function HomePage({ curatedData }: HomePageProps) {
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
                className="text-sm tracking-wide uppercase hover:text-primary transition-colors"
              >
                Archive
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
        <HeroSection data={curatedData.hero_section} />

        <div>
          <AtAGlance items={curatedData.at_a_glance} />
        </div>

        <div className="space-y-16">
          {curatedData.categorized_sections?.map((section, index) => (
            <CategorySection key={index} section={section} />
          ))}
        </div>
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
