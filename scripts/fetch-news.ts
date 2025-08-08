#!/usr/bin/env -S node --enable-source-maps
import Parser from 'rss-parser'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
import path from 'node:path'
import { SOURCES } from '../lib/sources'

type Item = {
  title: string
  source: string
  summary: string
  link: string
  publishedAt: string
}

const root = process.cwd()
const publicDir = path.join(root, 'public')
const outFile = path.join(publicDir, 'news.json')

const parser = new Parser({ timeout: 15000 })

const KEYWORDS = [
  "ai","a.i.","artificial intelligence","machine learning","ml",
  "neural","deep learning","generative","genai","foundation model",
  "llm","gpt","openai","anthropic","deepmind","meta ai","cohere",
  "mistral","stability ai","rag","vector db","fine-tune","prompt",
  "inference","token","transformer","diffusion"
];

function isAIItem(title = "", summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  // Use word boundaries to avoid false positives like "ai" matching "aid"
  return KEYWORDS.some(k => {
    // For single letters like "ai", "ml", "llm", "gpt", "rag" - use word boundaries
    if (k.length <= 3) {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      return regex.test(text);
    }
    // For longer phrases, use simple includes
    return text.includes(k);
  });
}

function normalizeUrl(u = "") {
  try {
    const url = new URL(u);
    url.searchParams.delete("utm_source");
    url.searchParams.delete("utm_medium");
    url.searchParams.delete("utm_campaign");
    url.hash = "";
    return url.toString();
  } catch { return u; }
}

async function fetchAll(): Promise<void> {
  const results: Item[] = []
  for (const src of SOURCES) {
    try {
      const feed = await parser.parseURL(src.rss)
      // per-source cap so no single source overwhelms
      let taken = 0;
      const PER_SOURCE_MAX = 6;
      for (const item of feed.items ?? []) {
        const title = (item.title || '').toString().trim();
        const link = normalizeUrl((item.link || item.guid || "").toString().trim());
        if (!title || !link) continue;

        const publishedRaw = (item as any).isoDate || (item as any).pubDate || (item as any).pubdate || (item as any).pub_date
        const parsed = publishedRaw ? DateTime.fromISO(publishedRaw) : null
        const publishedAt = parsed?.isValid ? parsed.toUTC().toISO() : null
        if (!publishedAt) continue;

        const summary = ((item as any).contentSnippet || (item as any).content || (item as any).summary || "").toString().replace(/\s+/g, ' ').trim();
        if (!isAIItem(title, summary)) continue; // 🚧 filter to AI-only
        
        results.push({
          title: title || '(untitled)',
          source: src.name,
          summary,
          link,
          publishedAt,
        });
        if (++taken >= PER_SOURCE_MAX) break;
      }
    } catch (err: any) {
      console.error('Failed fetching', src.name, err?.message || err)
    }
  }

  const seen = new Set<string>()
  const deduped = results.filter((r) => {
    if (seen.has(r.link)) return false
    seen.add(r.link)
    return true
  })

  deduped.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  const top = deduped.slice(0, 20)

  const nowNY = DateTime.now().setZone('America/New_York')
  const slot = nowNY.hour < 12 ? 'am' as const : 'pm' as const

  let existing: any = { updatedAt: DateTime.utc().toISO(), am: [], pm: [] }
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


