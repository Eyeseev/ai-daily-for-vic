import { type NewsItem } from '@/lib/types'
import { DateTime } from 'luxon'

export function NewsList({
  items,
  view,
  nowISO,
}: {
  items: NewsItem[]
  view: 'headlines' | 'summary'
  nowISO: string
}) {
  const now = DateTime.fromISO(nowISO)
  const sorted = [...items].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  return (
    <ol className="divide-y divide-neutral-800 rounded-lg ring-1 ring-neutral-800">
      {sorted.map((n) => {
        const when = DateTime.fromISO(n.publishedAt)
        const rel = when.toRelative({ base: now })
        return (
          <li key={n.link} className="p-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base leading-snug">
                <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {n.title}
                </a>
              </h3>
              <span className="shrink-0 text-xs text-neutral-500">{rel}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
              <span>{n.source}</span>
              <span>•</span>
              <time dateTime={n.publishedAt}>{when.toFormat('ccc t')}</time>
            </div>
            {view === 'summary' && n.summary && (
              <p className="mt-2 text-sm text-neutral-200 leading-relaxed">{n.summary}</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}


