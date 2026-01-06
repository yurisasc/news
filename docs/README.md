# Documentation

This directory contains detailed documentation for the various components of the News Summary Agent architecture.

## Components

- **[Linkwarden](./linkwarden/README.md)**: Configuration for RSS feed management and content archiving.
- **[n8n](./n8n/README.md)**: Automation workflows for fetching, classifying, and summarising news.
- **[NocoDB](./nocodb/README.md)**: Database schema and storage structure for news records and curated content.

## Architecture Overview

The system operates as a pipeline:
1.  **Ingest**: Linkwarden captures news from RSS feeds.
2.  **Process**: n8n automates the retrieval, classification (via LLMs), and summarization of this news.
3.  **Store**: NocoDB persists the processed data.
4.  **Display**: The Next.js frontend (this repo) queries NocoDB to present the curated news to the user.
