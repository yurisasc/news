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
