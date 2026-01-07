"use client";

import { Check, ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCategoryOrder } from "@/lib/category-order";
import { getSectionTitle, titleToSectionId } from "@/lib/section-utils";
import type { CategorySection } from "@/lib/types";

interface TableOfContentsProps {
  sections: CategorySection[];
  currentSection: string | null;
  sectionsRead: string[];
}

export function TableOfContents({ sections, currentSection, sectionsRead }: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sort sections by canonical order
  const sortedSections = [...sections].sort((a, b) => {
    const orderA = getCategoryOrder(a.title);
    const orderB = getCategoryOrder(b.title);
    return orderA - orderB;
  });

  // Add hero and at-a-glance to the list
  const allSections = [
    { id: "hero", title: getSectionTitle("hero") },
    { id: "at-a-glance", title: getSectionTitle("at-a-glance") },
    ...sortedSections.map((s) => ({
      id: titleToSectionId(s.title),
      title: s.title,
    })),
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileOpen(false);
  };

  const isSectionRead = (id: string) => sectionsRead.includes(id);
  const isCurrent = (id: string) => currentSection === id;

  return (
    <>
      {/* Mobile toggle button */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          size="icon"
          className="rounded-full shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close table of contents"
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Table of Contents</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <ChevronUp className="w-5 h-5" />
              </Button>
            </div>
            <SectionList
              sections={allSections}
              isSectionRead={isSectionRead}
              isCurrent={isCurrent}
              onScroll={scrollToSection}
            />
          </div>
        </div>
      )}

      {/* Desktop TOC */}
      <div className="hidden md:block">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Contents
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        {!isCollapsed && (
          <SectionList
            sections={allSections}
            isSectionRead={isSectionRead}
            isCurrent={isCurrent}
            onScroll={scrollToSection}
          />
        )}
      </div>
    </>
  );
}

interface SectionListProps {
  sections: Array<{ id: string; title: string }>;
  isSectionRead: (id: string) => boolean;
  isCurrent: (id: string) => boolean;
  onScroll: (id: string) => void;
}

function SectionList({ sections, isSectionRead, isCurrent, onScroll }: SectionListProps) {
  return (
    <nav className="space-y-1" aria-label="Table of contents">
      {sections.map((section) => {
        const read = isSectionRead(section.id);
        const current = isCurrent(section.id);

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onScroll(section.id)}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onScroll(section.id);
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
              current
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {read && <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500 shrink-0" />}
            {!read && <span className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
