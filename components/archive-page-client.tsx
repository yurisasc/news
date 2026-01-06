"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ArchiveCalendar } from "@/components/archive-calendar";
import { ArchiveHomepageView } from "@/components/archive-homepage-view";
import { NewsSearch } from "@/components/news-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CuratedRecord, NewsArticle } from "@/lib/types";

export function ArchivePageClient() {
  const [curatedArchive, setCuratedArchive] = useState<CuratedRecord[]>([]);
  const [newsArchive, setNewsArchive] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState<CuratedRecord | null>(null);

  useEffect(() => {
    async function loadArchiveData() {
      try {
        const [curatedRes, newsRes] = await Promise.all([
          fetch("/api/curated/archive"),
          fetch("/api/news"),
        ]);

        const curatedData = await curatedRes.json();
        const newsData = await newsRes.json();

        setCuratedArchive(curatedData.list || []);
        setNewsArchive(newsData.list || []);
      } catch (err) {
        console.error("Error loading archive data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArchiveData();
  }, []);

  const handleSelectDate = (archive: CuratedRecord | null) => {
    setSelectedArchive(archive);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-3xl font-serif font-bold text-foreground">
              Obluda
            </a>
            <nav className="flex items-center gap-8">
              <a href="/archive" className="text-sm tracking-wide uppercase text-primary">
                Archive
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-serif font-bold mb-4 text-balance">Archive</h1>
          <p className="text-lg text-muted-foreground">
            Browse historical curated homepages and search our complete news database
          </p>
        </div>

        <Tabs defaultValue="curated" className="mt-8">
          <TabsList className="mb-8">
            <TabsTrigger value="curated">Curated Homepages</TabsTrigger>
            <TabsTrigger value="news">All News Records</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading archive...</span>
            </div>
          ) : (
            <>
              <TabsContent value="curated">
                {selectedArchive ? (
                  <ArchiveHomepageView
                    archive={selectedArchive}
                    onBack={() => setSelectedArchive(null)}
                  />
                ) : (
                  <div className="grid gap-8 lg:grid-cols-[350px,1fr]">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
                      <ArchiveCalendar
                        archives={curatedArchive}
                        onSelectDate={handleSelectDate}
                        selectedDate={null}
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        Click on a dotted date to view that day's curated homepage.
                      </p>
                    </div>
                    <div className="lg:border-l lg:border-border lg:pl-8">
                      <h2 className="text-lg font-semibold mb-4">Recent Archives</h2>
                      <div className="space-y-4">
                        {curatedArchive.slice(0, 5).map((archive) => {
                          const date = new Date(archive.fields.Date);
                          return (
                            <button
                              key={String(archive.id)}
                              type="button"
                              onClick={() => setSelectedArchive(archive)}
                              className="w-full text-left p-4 border border-border rounded-lg hover:border-primary transition-colors"
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
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="news">
                <NewsSearch initialData={newsArchive} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
