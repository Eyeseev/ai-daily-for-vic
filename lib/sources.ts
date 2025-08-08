// lib/sources.ts
// Central list of sources. Add/remove feeds here.
// Use tag/category RSS endpoints where available for AI.

export type Source = {
  id: string
  name: string
  homepage: string
  rss: string
}

export const SOURCES: Source[] = [
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch – AI',
    homepage: 'https://techcrunch.com/tag/artificial-intelligence/',
    rss: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat – AI',
    homepage: 'https://venturebeat.com/category/ai/',
    rss: 'https://venturebeat.com/category/ai/feed/',
  },
  {
    id: 'theverge-ai',
    name: 'The Verge – AI',
    homepage: 'https://www.theverge.com/ai-artificial-intelligence',
    rss: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
  // General feeds → filtered by keywords in fetcher:
  {
    id: 'wired',
    name: 'WIRED',
    homepage: 'https://www.wired.com/',
    rss: 'https://www.wired.com/feed/',
  },
  {
    id: 'mittr',
    name: 'MIT Tech Review',
    homepage: 'https://www.technologyreview.com/',
    rss: 'https://www.technologyreview.com/feed/',
  },
  // New AI-focused sources added 2025-08-08:
  {
    id: 'towards-data-science',
    name: 'Towards Data Science',
    homepage: 'https://towardsdatascience.com/',
    rss: 'https://towardsdatascience.com/feed',
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica – AI',
    homepage: 'https://arstechnica.com/tag/artificial-intelligence/',
    rss: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
  },
  {
    id: 'the-register',
    name: 'The Register – AI',
    homepage: 'https://www.theregister.com/tag/ai/',
    rss: 'https://www.theregister.com/headlines.atom',
  },
  {
    id: 'ai-trends',
    name: 'AI Trends',
    homepage: 'https://www.aitrends.com/',
    rss: 'https://www.aitrends.com/feed/',
  },
  {
    id: 'synced',
    name: 'Synced',
    homepage: 'https://syncedreview.com/',
    rss: 'https://syncedreview.com/feed/',
  },
]


