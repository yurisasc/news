"use client";

import { format } from "date-fns";
import { CalendarIcon, ExternalLink, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import type { NewsArticle } from "@/lib/types";

interface NewsSearchProps {
  initialData: NewsArticle[];
  initialPage?: number;
}

type SearchField = "all" | "title" | "content" | "category";

const ITEMS_PER_PAGE = 20;

export function NewsSearch({ initialData, initialPage = 1 }: NewsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const fieldParam = searchParams.get("field");
  const [searchField, setSearchField] = useState<SearchField>((fieldParam as SearchField) || "all");
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const [startDate, setStartDate] = useState<Date | undefined>(
    fromParam ? new Date(fromParam) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(toParam ? new Date(toParam) : undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Build query string from current filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchField !== "all") params.set("field", searchField);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (startDate) params.set("from", format(startDate, "yyyy-MM-dd"));
    if (endDate) params.set("to", format(endDate, "yyyy-MM-dd"));
    return params.toString();
  }, [searchQuery, searchField, selectedCategory, startDate, endDate]);

  // Build URL for pagination links with current filters preserved
  const buildPageUrl = useCallback(
    (page: number) => {
      const qs = buildQueryString();
      const basePath = page === 1 ? "/archive/news" : `/archive/news/page/${page}`;
      return qs ? `${basePath}?${qs}` : basePath;
    },
    [buildQueryString],
  );

  // Update URL when filters change (debounced for search input)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const qs = buildQueryString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, 300);
    return () => clearTimeout(timeout);
  }, [buildQueryString, pathname, router]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialData.forEach((article) => {
      if (article.fields.Category) cats.add(article.fields.Category);
    });
    return Array.from(cats).sort();
  }, [initialData]);

  const filteredNews = useMemo(() => {
    let results = initialData;

    // Filter by search query and field
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((article) => {
        switch (searchField) {
          case "title":
            return article.fields.Title?.toLowerCase().includes(query);
          case "content":
            return article.fields.Content?.toLowerCase().includes(query);
          case "category":
            return article.fields.Category?.toLowerCase().includes(query);
          default:
            return (
              article.fields.Title?.toLowerCase().includes(query) ||
              article.fields.Content?.toLowerCase().includes(query) ||
              article.fields.Category?.toLowerCase().includes(query)
            );
        }
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((article) => article.fields.Category === selectedCategory);
    }

    // Filter by date range
    if (startDate) {
      results = results.filter((article) => {
        if (!article.fields["Created Date"]) return false;
        const articleDate = new Date(article.fields["Created Date"]);
        return articleDate >= startDate;
      });
    }

    if (endDate) {
      results = results.filter((article) => {
        if (!article.fields["Created Date"]) return false;
        const articleDate = new Date(article.fields["Created Date"]);
        // Set end date to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return articleDate <= endOfDay;
      });
    }

    return results;
  }, [searchQuery, searchField, selectedCategory, startDate, endDate, initialData]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  // Sync currentPage with initialPage when navigating between pages
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSearchField("all");
    setSelectedCategory("all");
    setStartDate(undefined);
    setEndDate(undefined);
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || startDate || endDate;

  return (
    <div className="overflow-x-hidden">
      <div className="mb-8 space-y-4">
        {/* Search input with field selector */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="relative w-full sm:flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search by ${
                searchField === "all" ? "title, content, or category" : searchField
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Select value={searchField} onValueChange={(v) => setSearchField(v as SearchField)}>
            <SelectTrigger className="w-full sm:w-36 h-12">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category and Date filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Start Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-40 justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM d, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>

          {/* End Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-40 justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM d, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredNews.length} {filteredNews.length === 1 ? "article" : "articles"} found
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {paginatedNews.map((article) => (
          <Card key={String(article.id)} className="p-6 hover:border-primary transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {article.fields.Category && (
                    <Badge variant="secondary" className="text-xs">
                      {article.fields.Category}
                    </Badge>
                  )}
                  {article.fields["Created Date"] && (
                    <time className="text-xs text-muted-foreground">
                      {new Date(article.fields["Created Date"]).toLocaleDateString()}
                    </time>
                  )}
                </div>

                <h3 className="text-xl font-serif font-bold mb-2 leading-tight wrap-break-word">
                  <a
                    href={`/reader/${article.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {article.fields.Title}
                  </a>
                </h3>

                {article.fields.Content && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.fields.Content}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={`/reader/${article.id}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Read in Reader Mode
                  </a>

                  {article.fields.URL && (
                    <a
                      href={article.fields.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors max-w-xs truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">Source</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {paginatedNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your filters.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 py-4 border-t border-border">
          {currentPage > 1 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildPageUrl(currentPage - 1)}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(isMobile ? 4 : 5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= (isMobile ? 4 : 5)) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - (isMobile ? 3 : 4) + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                  asChild
                >
                  <Link href={buildPageUrl(pageNum)}>{pageNum}</Link>
                </Button>
              );
            })}
          </div>

          {currentPage < totalPages ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildPageUrl(currentPage + 1)}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
