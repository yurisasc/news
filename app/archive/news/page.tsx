import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsSearch } from "@/components/news-search";
import { fetchArchiveData } from "@/lib/api";

export const metadata: Metadata = {
  title: "News Archive",
  description: "Search and browse all news articles in the Obluda archive.",
};

export default async function NewsArchivePage() {
  const { articles } = await fetchArchiveData();

  return articles.length > 0 ? (
    <Suspense fallback={<div className="text-muted-foreground">Loading news...</div>}>
      <NewsSearch initialData={articles} />
    </Suspense>
  ) : (
    <p className="text-muted-foreground">No news records available.</p>
  );
}
