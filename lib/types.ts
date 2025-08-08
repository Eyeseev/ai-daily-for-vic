export type NewsItem = {
  title: string
  source: string
  summary?: string      // <-- add optional
  description?: string  // <-- optional fallback
  link: string
  publishedAt: string // ISO
}

export type NewsBundle = {
  updatedAt: string
  am: NewsItem[]
  pm: NewsItem[]
}


