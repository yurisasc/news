import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveCalendar } from "@/components/archive-calendar";
import { fetchArchiveData } from "@/lib/api";

export const metadata: Metadata = {
  title: "Homepage Archive",
  description: "Browse archived Obluda homepage editions by date.",
};

export default async function HomepageArchivePage() {
  const { curatedHomepages } = await fetchArchiveData();
  const sorted = [...curatedHomepages].sort(
    (a, b) =>
      new Date(b.fields.Date).getTime() - new Date(a.fields.Date).getTime(),
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="shrink-0">
        <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
        <ArchiveCalendar
          archives={curatedHomepages}
          linkPrefix="/archive/homepage"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Click on a dotted date to view that day's curated homepage.
        </p>
      </div>
      <div className="flex-1 md:border-l md:border-border md:pl-8 min-w-0">
        <h2 className="text-lg font-semibold mb-4">Recent Archives</h2>
        <div className="space-y-4">
          {sorted.slice(0, 5).map((archive) => {
            const date = new Date(archive.fields.Date);
            return (
              <Link
                key={String(archive.id)}
                href={`/archive/homepage/${archive.fields.Date}`}
                className="block w-full text-left p-4 border border-border rounded-lg hover:border-primary transition-colors"
              >
                <time className="text-sm text-muted-foreground">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="text-lg font-serif font-bold mt-1 line-clamp-1">
                  {archive.fields.Data.hero_section.headline}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
