## AI Daily for Vic

Top AI news from multiple sources, twice daily (7:30 AM/PM America/New_York). Static `public/news.json` served by Next.js. Minimal JS, mobile-first.

### Commands
- `npm run dev` — start Next.js dev
- `npm run fetch` — fetch RSS and write `public/news.json`

### Deployment
- Push to GitHub; the `refresh.yml` workflow updates `public/news.json` on schedule.
- Deploy to Vercel. For private preview, set `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` as environment variables and add middleware if desired.

### Sources
Edit `lib/sources.ts` to add/remove feeds.


