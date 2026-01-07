"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { NewsArticle } from "@/lib/types";
import { extractFavicon } from "@/lib/utils";

interface ReaderViewProps {
  article: NewsArticle;
}

export function ReaderView({ article }: ReaderViewProps) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<{
    favicon?: string;
    pageTitle?: string;
  }>({});

  useEffect(() => {
    if (article.fields.URL) {
      const favicon = extractFavicon(article.fields.URL);
      setMetadata({ favicon });
    }
  }, [article.fields.URL]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {
                // Prefer browser history to preserve filters/search/pagination
                if (
                  typeof window !== "undefined" &&
                  window.history.length > 1
                ) {
                  window.history.back();
                } else {
                  router.push("/archive/news");
                }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {article.fields.URL && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={article.fields.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {article.fields.Category && (
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold tracking-wide uppercase rounded">
              {article.fields.Category}
            </span>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-balance">
          {article.fields.Title}
        </h1>

        {article.fields["Created Date"] && (
          <time className="block text-base text-muted-foreground mb-8">
            {new Date(article.fields["Created Date"]).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </time>
        )}

        {article.fields.URL && (
          <div className="flex items-center gap-3 mb-8 p-4 bg-muted rounded-lg">
            {metadata.favicon && (
              <Image
                src={metadata.favicon || "/placeholder.svg"}
                alt="Source favicon"
                className="w-4 h-4"
                width={16}
                height={16}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <a
              href={article.fields.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span className="truncate">
                {new URL(article.fields.URL).hostname.replace("www.", "")}
              </span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {article.fields.Content ? (
            <div className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {article.fields.Content}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Content not available. Please visit the original source.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
