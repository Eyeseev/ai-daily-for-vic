import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'AI Daily for Vic',
  description: 'Top AI news, twice daily.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-neutral-100">
      <body className="min-h-screen antialiased selection:bg-emerald-300 selection:text-neutral-900">
        {children}
      </body>
    </html>
  )
}


