export interface NocoDBRecord<T> {
  id: string | number;
  fields: T;
}

export interface NocoDBResponse<T> {
  records: NocoDBRecord<T>[];
  next?: string | null;
  prev?: string | null;
}

// News table fields
export interface NewsArticle {
  id: string | number;
  fields: {
    Title: string;
    Content: string;
    URL: string;
    Category: string;
    "Created Date": string;
  };
  favicon?: string;
  pageTitle?: string;
}

// Homepage table fields
export interface CuratedRecord {
  id: string | number;
  fields: {
    Date: string;
    Data: CuratedHomepage;
  };
}

export interface HeroSection {
  headline: string;
  summary: string;
  takeaways: string[];
  sources: string[];
}

export interface Story {
  headline: string;
  summary: string;
  takeaways?: string[];
  sources: string[];
}

export interface CategorySection {
  title: string;
  stories: Story[];
}

export interface AtAGlanceItem {
  update: string;
  sources: string[];
}

export interface CuratedHomepage {
  hero_section: HeroSection;
  at_a_glance: AtAGlanceItem[];
  categorized_sections: CategorySection[];
}

// Reading progress tracking
export interface ReadingProgress {
  scrollPosition: number;
  maxScrollPosition: number;
  totalContentHeight: number;
  percentage: number;
  sectionsRead: string[];
  currentSection: string | null;
}

// Section metadata for tracking
export interface SectionInfo {
  id: string;
  title: string;
  order: number;
  offsetTop: number;
  height: number;
  isRead: boolean;
}

// Persisted completion state (localStorage)
export interface CompletionState {
  pageId: string;
  date: string;
  completedAt: string | null;
  isComplete: boolean;
  scrollPercentage: number;
  sectionsRead: string[];
  hasDismissedCelebration: boolean;
}

// Category ordering configuration
export interface CategoryOrderConfig {
  [categoryName: string]: number;
}
