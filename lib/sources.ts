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
]


