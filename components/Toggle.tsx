"use client"

import { useEffect, useState } from 'react'
import clsx from 'clsx'

export function Toggle({ view }: { view: 'headlines' | 'summary' }) {
  const [current, setCurrent] = useState(view)

  useEffect(() => setCurrent(view), [view])

  const setQuery = (next: 'headlines' | 'summary') => {
    const url = new URL(window.location.href)
    url.searchParams.set('view', next)
    window.history.replaceState({}, '', url.toString())
    setCurrent(next)
  }

  return (
    <div className="inline-flex rounded-full bg-neutral-800 p-1 text-xs">
      {(['headlines', 'summary'] as const).map((v) => (
        <button
          key={v}
          onClick={() => setQuery(v)}
          className={clsx(
            'px-3 py-1 rounded-full transition-colors',
            current === v ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-300'
          )}
        >
          {v === 'headlines' ? 'Headlines' : 'Summaries'}
        </button>
      ))}
    </div>
  )
}


