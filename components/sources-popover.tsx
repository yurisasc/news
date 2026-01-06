"use client";

import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SourceInfo {
  url: string;
  title: string;
  favicon: string;
  hostname: string;
}

interface SourcesPopoverProps {
  sources: string[];
  maxVisible?: number;
  /**
   * When provided, skips inline chips and uses this label on the trigger button.
   * Useful for compact displays (e.g., "3 sources").
   */
  triggerLabel?: string;
}

export function SourcesPopover({
  sources,
  maxVisible = 3,
  triggerLabel,
}: SourcesPopoverProps) {
  const [sourceInfos, setSourceInfos] = useState<SourceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse sources and extract info
    const infos = sources.map((url) => {
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace("www.", "");
        return {
          url,
          title: decodeURIComponent(
            urlObj.pathname.split("/").filter(Boolean).pop() || "Article",
          ).replace(/-/g, " "),
          favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
          hostname,
        };
      } catch {
        return {
          url,
          title: "Article",
          favicon: "",
          hostname: "Unknown",
        };
      }
    });
    setSourceInfos(infos);
    setLoading(false);
  }, [sources]);

  // Group sources by hostname
  const groupedSources = sourceInfos.reduce((acc, source) => {
    if (!acc[source.hostname]) {
      acc[source.hostname] = [];
    }
    acc[source.hostname].push(source);
    return acc;
  }, {} as Record<string, SourceInfo[]>);

  const visibleSources = triggerLabel ? [] : sourceInfos.slice(0, maxVisible);
  const hasMore = triggerLabel
    ? sourceInfos.length > 0
    : sourceInfos.length > maxVisible;
  const buttonLabel =
    triggerLabel ??
    (sourceInfos.length > maxVisible
      ? `+${sourceInfos.length - maxVisible} more`
      : "");

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Show first few sources inline unless a custom triggerLabel is provided */}
      {visibleSources.map((source, index) => (
        <a
          key={index}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border rounded hover:bg-accent hover:border-accent-foreground/20 transition-colors"
        >
          {source.favicon && (
            <Image
              src={source.favicon || "/placeholder.svg"}
              alt=""
              className="w-3 h-3"
              width={12}
              height={12}
            />
          )}
          <span>{source.hostname}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
        </a>
      ))}

      {/* Popover for all sources if more than maxVisible */}
      {hasMore && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs gap-1 bg-transparent"
            >
              {buttonLabel}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 mr-4" align="start">
            <div className="px-3 py-2 border-b border-border">
              <h4 className="text-sm font-semibold">
                All Sources ({sourceInfos.length})
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedSources).map(([hostname, sources]) => (
                <div
                  key={hostname}
                  className="border-b border-border last:border-0"
                >
                  <div className="px-3 py-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      {sources[0].favicon && (
                        <Image
                          src={sources[0].favicon || "/placeholder.svg"}
                          alt=""
                          className="w-4 h-4"
                          width={16}
                          height={16}
                        />
                      )}
                      <span className="text-xs font-medium text-muted-foreground">
                        {hostname}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        ({sources.length}{" "}
                        {sources.length === 1 ? "article" : "articles"})
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-border/50">
                    {sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors group"
                      >
                        <span className="text-sm flex-1 line-clamp-1 capitalize">
                          {source.title}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Always show "View all" button if more than 1 source */}
      {sourceInfos.length > 1 && !hasMore && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              View all
              <ChevronDown className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 mr-4" align="start">
            <div className="px-3 py-2 border-b border-border">
              <h4 className="text-sm font-semibold">
                All Sources ({sourceInfos.length})
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedSources).map(([hostname, sources]) => (
                <div
                  key={hostname}
                  className="border-b border-border last:border-0"
                >
                  <div className="px-3 py-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      {sources[0].favicon && (
                        <Image
                          src={sources[0].favicon || "/placeholder.svg"}
                          alt=""
                          className="w-4 h-4"
                          width={16}
                          height={16}
                        />
                      )}
                      <span className="text-xs font-medium text-muted-foreground">
                        {hostname}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        ({sources.length}{" "}
                        {sources.length === 1 ? "article" : "articles"})
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-border/50">
                    {sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors group"
                      >
                        <span className="text-sm flex-1 line-clamp-1 capitalize">
                          {source.title}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
