# Linkwarden Configuration

[Linkwarden](https://linkwarden.app/) is used in this project to manage RSS subscriptions and archive news content. It acts as the primary data ingestion source for the news pipeline.

## RSS Sources

The following RSS feeds are subscribed to in Linkwarden:

### International
- **Al Jazeera**: `https://www.aljazeera.com/xml/rss/all.xml`
- **Al Jazeera Economy**: `https://rss.app/feeds/Myjz5v6wpw95cB5R.xml`

### Regional & Local (Indonesia)
- **Tempo English**: `https://rss.tempo.co/en`
- **Tempo Nasional**: `https://rss.tempo.co/nasional`
- **Tempo Bisnis**: `https://rss.tempo.co/bisnis`

## Role in Architecture

1.  **Subscription Management**: Linkwarden monitors these RSS feeds for new articles.
2.  **Content Archiving**: When a new article is detected, Linkwarden fetches and archives the content (preserving text, images, etc.).
3.  **Data Source**: The n8n automation pipeline queries Linkwarden to retrieve the latest archived articles for processing.
