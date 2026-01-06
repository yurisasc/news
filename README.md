[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# What is this?

This project is an AI-powered news curation and summary agent. It automates the process of gathering, filtering, summarizing, and presenting global and local news, specifically tailored for an Indonesian context.

## 🚀 How It Works

This project operates as a fully automated pipeline:

1.  **Ingestion**: **Linkwarden** monitors RSS feeds (Al Jazeera, Tempo, etc.) and archives new articles.
2.  **Orchestration**: **n8n** workflows fetch these articles and coordinate a team of AI Agents.
3.  **Intelligence**:
    *   **Classifier Agent**: Reads metadata to categorize stories and assign a priority score (1-10) based on relevance.
    *   **Summariser Agent**: Groups related articles and synthesizes them into concise "Storylines".
    *   **Final Stitch Agent**: Curates the daily homepage, selecting a "Hero" story and organizing the rest.
4.  **Storage**: Processed data is stored in **NocoDB**.
5.  **Presentation**: This **Next.js** application fetches the curated data and presents it in a clean, distraction-free interface.

## ✨ Features

*   **Daily Curated Homepage**: A newspaper-like layout featuring the day's most important stories.
*   **AI Summaries**: Concise, fact-based summaries synthesized from multiple sources.
*   **Relevance Scoring**: News is prioritized based on its impact on Indonesia and global significance.
*   **Reader Mode**: Distraction-free reading experience for individual articles.
*   **Searchable Archive**: Full history of curated editions and a searchable database of all processed news.
*   **Transparency**: Every summary links back to its original sources.

## 🛠️ Tech Stack

*   **Frontend**: [Next.js 16](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind 4](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
*   **Database**: [NocoDB](https://nocodb.com/)
*   **Automation**: [n8n](https://n8n.io/)
*   **Ingestion**: [Linkwarden](https://linkwarden.app/)
*   **AI/LLM**: [OpenRouter](https://openrouter.ai/) (Grok, Qwen, etc.)

## 📂 Documentation

Detailed documentation for the backend architecture is available in the [`docs/`](./docs/README.md) directory:

*   [**Linkwarden Setup**](./docs/linkwarden/README.md) - RSS Feeds & Archiving
*   [**n8n Workflows**](./docs/n8n/README.md) - Agent Logic & Flow
*   [**NocoDB Schema**](./docs/nocodb/README.md) - Database Structure

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18+)
*   pnpm
*   Access to the NocoDB instance (API Token required)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/news.git
    cd news
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Configure environment variables:
    Copy `.env.example` to `.env.local` and fill in your NocoDB credentials.
    ```bash
    cp .env.example .env.local
    ```
    
    Required variables:
    *   `NOCODB_API_BASE`: URL of your NocoDB instance
    *   `NOCODB_API_TOKEN`: Your API Token
    *   `NOCODB_NEWS_TABLE`: Table ID for news items
    *   `NOCODB_CURATED_TABLE`: Table ID for curated homepages

4.  Run the development server:
    ```bash
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
