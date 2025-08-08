import { NextResponse, type NextRequest } from 'next/server'

// Basic auth (disabled if env vars are not set)
export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER
  const pass = process.env.BASIC_AUTH_PASS
  if (!user || !pass) return NextResponse.next()

  const header = req.headers.get('authorization')
  if (!header?.startsWith('Basic ')) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure"' },
    })
  }
  const credentials = atob(header.split(' ')[1] || '')
  const [u, p] = credentials.split(':')
  if (u === user && p === pass) return NextResponse.next()
  return new Response('Forbidden', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Secure"' } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|news.json).*)'],
}


