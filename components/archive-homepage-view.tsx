"use client";

import { format } from "date-fns";
import { ArrowLeft, Calendar } from "lucide-react";
import { AtAGlance } from "@/components/at-a-glance";
import { CategorySection } from "@/components/category-section";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import type { CuratedRecord } from "@/lib/types";

interface ArchiveHomepageViewProps {
  archive: CuratedRecord;
  onBack: () => void;
}

export function ArchiveHomepageView({ archive, onBack }: ArchiveHomepageViewProps) {
  const date = new Date(archive.fields.Date);
  const data = archive.fields.Data;

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent">
            <Calendar className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Archive Edition
            </p>
            <h2 className="text-2xl font-serif font-bold">{format(date, "EEEE, MMMM d, yyyy")}</h2>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection data={data.hero_section} />

      {/* At a Glance */}
      {data.at_a_glance && data.at_a_glance.length > 0 && <AtAGlance items={data.at_a_glance} />}

      {/* Categorized Sections */}
      <div className="space-y-16 mt-16">
        {data.categorized_sections?.map((section, index) => (
          <CategorySection key={index} section={section} />
        ))}
      </div>
    </div>
  );
}
