#!/usr/bin/env node
import Parser from 'rss-parser'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
import path from 'node:path'
import sources from '../lib/sources.json' assert { type: 'json' }

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')
const outFile = path.join(publicDir, 'news.json')

const SOURCES = sources

const parser = new Parser({ timeout: 15000 })

async function fetchAll() {
  const results = []
  for (const src of SOURCES) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of feed.items ?? []) {
        const publishedRaw = item.isoDate || item.pubDate || item.pubdate || item.pub_date
        const publishedAt = publishedRaw ? DateTime.fromISO(publishedRaw).toUTC().toISO() : null
        if (!publishedAt) continue
        results.push({
          title: item.title?.trim() ?? '(untitled)',
          source: src.name,
          summary: (item.contentSnippet || item.content || '').toString().replace(/\s+/g, ' ').trim(),
          link: item.link ?? '#',
          publishedAt,
        })
      }
    } catch (err) {
      console.error('Failed fetching', src.name, err?.message || err)
    }
  }

  // De-duplicate by link
  const seen = new Set()
  const deduped = results.filter((r) => {
    if (seen.has(r.link)) return false
    seen.add(r.link)
    return true
  })

  // Sort newest first
  deduped.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  // Keep top 20
  const top = deduped.slice(0, 20)

  // Split by AM/PM based on America/New_York current time bucket
  const nowNY = DateTime.now().setZone('America/New_York')
  const hour = nowNY.hour
  const slot = hour < 12 ? 'am' : 'pm'

  let existing = { updatedAt: DateTime.utc().toISO(), am: [], pm: [] }
  try {
    const prev = JSON.parse(await fs.readFile(outFile, 'utf8'))
    existing = prev
  } catch {}

  const updated = {
    updatedAt: DateTime.utc().toISO(),
    am: slot === 'am' ? top : existing.am || [],
    pm: slot === 'pm' ? top : existing.pm || [],
  }

  await fs.mkdir(publicDir, { recursive: true })
  await fs.writeFile(outFile, JSON.stringify(updated, null, 2) + '\n', 'utf8')
  console.log('Wrote', outFile, 'with', top.length, 'items to', slot.toUpperCase())
}

fetchAll().catch((e) => {
  console.error(e)
  process.exit(1)
})


