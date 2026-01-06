"use client";

import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import type { CuratedRecord } from "@/lib/types";

interface ArchiveListProps {
  archives: CuratedRecord[];
}

export function ArchiveList({ archives }: ArchiveListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {archives.map((archive) => {
        const date = new Date(archive.fields.Date);
        return (
          <Card
            key={String(archive.id)}
            className="p-6 hover:border-primary transition-colors cursor-pointer"
          >
            <div className="mb-4">
              <time className="text-sm text-muted-foreground">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-xs text-muted-foreground ml-2">
                ({formatDistanceToNow(date, { addSuffix: true })})
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2">
              {archive.fields.Data.hero_section.headline}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {archive.fields.Data.hero_section.summary}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {archive.fields.Data.categorized_sections?.length || 0} sections
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                View →
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
