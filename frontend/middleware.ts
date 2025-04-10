import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Sincronizar cookies entre dominios
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Set-Cookie',
      `session_cookie=${request.cookies.get('session_cookie')?.value}; SameSite=None; Secure`
    )
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
