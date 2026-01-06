# NocoDB Database Schema

[NocoDB](https://nocodb.com/) is used as the persistent storage layer for the News Summary Agent. It stores both the individual classified news articles and the daily curated homepage JSON structure.

## Tables

### 1. News Table
Stores individual high-priority news articles after they have been processed and classified by the n8n workflow.

| Field Name     | Type     | Description                                      |
| :------------- | :------- | :----------------------------------------------- |
| `Title`        | Text     | The headline of the article.                     |
| `Content`      | LongText | The raw text content or snippet of the article.  |
| `URL`          | URL      | The original source URL of the article.          |
| `Category`     | Text     | AI-assigned category (e.g., Economy & Business). |
| `Created Date` | DateTime | Timestamp when the article was published/ingested. |

### 2. Curated Homepage Table
Stores the aggregated and structured daily summaries used to render the frontend.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `Date` | DateTime | The date of the curated edition. Used for sorting and history. |
| `Data` | JSON | A structured JSON object containing the full homepage content. |

#### `Data` JSON Structure
The `Data` field conforms to the `CuratedHomepage` interface defined in the application:

```typescript
interface CuratedHomepage {
  hero_section: {
    headline: string;
    summary: string;
    takeaways: string[];
    sources: string[];
  };
  at_a_glance: Array<{
    update: string;
    sources: string[];
  }>;
  categorized_sections: Array<{
    title: string;
    stories: Array<{
      headline: string;
      summary: string;
      takeaways?: string[];
      sources: string[];
    }>;
  }>;
}
```

## API Access

The Next.js application connects to NocoDB using the REST API to:
1.  Fetch the latest `CuratedRecord` for the homepage.
2.  Fetch historical `CuratedRecord`s for the archive view.
3.  Search through `NewsArticle` records for the "All News" database view.
