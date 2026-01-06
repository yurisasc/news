"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ReaderView } from "@/components/reader-view";
import type { NewsArticle } from "@/lib/types";

interface ReaderPageClientProps {
  id: string;
}

export function ReaderPageClient({ id }: ReaderPageClientProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/news/${id}`);
        const data = await res.json();

        if (data.error) {
          setError(true);
        } else if (data.data) {
          setArticle(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading article:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <a href="/archive" className="text-primary hover:underline">
            Back to Archive
          </a>
        </div>
      </div>
    );
  }

  return <ReaderView article={article} />;
}
