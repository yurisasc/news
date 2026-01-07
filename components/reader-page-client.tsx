"use client";

import { ReaderView } from "@/components/reader-view";
import type { NewsArticle } from "@/lib/types";

interface ReaderPageClientProps {
  id: string;
  initialArticle: NewsArticle;
}

export function ReaderPageClient({ initialArticle }: ReaderPageClientProps) {
  return <ReaderView article={initialArticle} />;
}
