"use client";

import type { NewsArticle } from "@/lib/types";
import { ReaderView } from "./reader-view";

interface ReaderPageClientProps {
  id: string;
  initialArticle: NewsArticle;
}

export function ReaderPageClient({ initialArticle }: ReaderPageClientProps) {
  return <ReaderView article={initialArticle} />;
}
