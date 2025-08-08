import { DateTime } from 'luxon'

export function Header({ lastUpdated, tz }: { lastUpdated: string; tz: string }) {
  const dt = DateTime.fromISO(lastUpdated).setZone(tz)
  const formatted = dt.toFormat('ccc, LLL d, t ZZZZ')
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">AI Daily</h1>
      <p className="text-sm text-neutral-400">Updated {formatted}</p>
    </header>
  )
}


