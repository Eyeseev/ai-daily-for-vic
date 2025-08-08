import { Header } from '@/components/Header'
import { NewsList } from '@/components/NewsList'
import { HeaderTabs } from '@/components/HeaderTabs'
import SummaryList from '@/components/SummaryList'
import { type NewsBundle } from '@/lib/types'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

async function readNews(): Promise<NewsBundle> {
  const filePath = path.join(process.cwd(), 'public', 'news.json')
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { view?: string }
}) {
  const bundle = await readNews()
  const tz = 'America/New_York'
  const now = DateTime.now().setZone(tz)
  const view = (searchParams?.view || "headlines").toLowerCase()

  return (
    <main className="mx-auto max-w-screen-sm px-4 py-6">
      <Header lastUpdated={bundle.updatedAt} tz={tz} />
      <HeaderTabs activeView={view} />
      {view === "summary" ? (
        <SummaryList items={bundle} />
      ) : (
        <section className="mt-6 space-y-10">
          {(['am', 'pm'] as const).map((slot) => (
            <div key={slot}>
              <h2 className="mb-3 text-xs uppercase tracking-widest text-neutral-400">
                {slot === 'am' ? 'Morning' : 'Evening'} Edition
                <span className="ml-2 text-neutral-500">(7:30 {slot.toUpperCase()} ET)</span>
              </h2>
              <NewsList items={bundle[slot]} view={view as 'headlines' | 'summary'} nowISO={now.toISO()!} />
            </div>
          ))}
        </section>
      )}
    </main>
  )
}


