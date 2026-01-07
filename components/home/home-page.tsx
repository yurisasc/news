"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useUnifiedReadingProgress } from "@/hooks/reading/use-unified-reading-progress";
import { sortCategories } from "@/lib/category-order";
import { TIMEZONE } from "@/lib/date-utils";
import type { CuratedHomepage } from "@/lib/types";
import { CompletionCelebration } from "../reading/completion-celebration";
import { ReadingProgress } from "../reading/reading-progress";
import { TableOfContents } from "../reading/table-of-contents";
import { AtAGlance } from "./at-a-glance";
import { CategorySection } from "./category-section";
import { HeroSection } from "./hero-section";

interface HomePageProps {
  curatedData: CuratedHomepage;
}

export function HomePage({ curatedData }: HomePageProps) {
  const sortedSections = sortCategories(curatedData.categorized_sections || []);
  const totalSections = 2 + sortedSections.length;

  const readingState = useUnifiedReadingProgress("homepage", totalSections);

  const handleCategoryRef = (element: HTMLElement | null) => {
    if (element) {
      const sectionId = element.id;
      if (sectionId && sectionId !== "hero" && sectionId !== "at-a-glance") {
        readingState.registerSection(sectionId, element);
      }
    }
  };

  const formattedDate = formatInTimeZone(
    new Date(curatedData.date),
    TIMEZONE,
    "EEEE, MMMM d, yyyy",
  );

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress
        progress={{
          percentage: readingState.percentage,
          scrollPosition: readingState.scrollPosition,
          maxScrollPosition: 0,
          totalContentHeight: 0,
          currentSection: readingState.currentSection,
          sectionsRead: readingState.sectionsRead,
        }}
        totalSections={totalSections}
      />

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {readingState.isComplete && (
          <div className="mb-8 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              ✓ You're all caught up for today! Come back tomorrow for the latest news.
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full text-sm font-medium text-accent-foreground">
            <span>Daily Digest</span>
            <span className="text-accent-foreground/60">·</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <HeroSection ref={readingState.registerHeroSection} data={curatedData.hero_section} />

            <div className="mb-16">
              <AtAGlance
                ref={readingState.registerAtAGlanceSection}
                items={curatedData.at_a_glance}
              />
            </div>

            <div className="space-y-16">
              {sortedSections.map((section, index) => (
                <CategorySection
                  key={index}
                  section={section}
                  order={index}
                  onRef={handleCategoryRef}
                />
              ))}
            </div>
          </div>

          <aside className="hidden lg:block w-64 shrink-0 sticky top-20 h-fit">
            <TableOfContents
              sections={sortedSections}
              currentSection={readingState.currentSection}
              sectionsRead={readingState.sectionsRead}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-muted-foreground text-center">
            {new Date().getFullYear()} Obluda. All rights reserved.
          </p>
        </div>
      </footer>

      <CompletionCelebration
        isVisible={readingState.showCelebration}
        onDismiss={readingState.dismissCelebration}
      />
    </div>
  );
}
