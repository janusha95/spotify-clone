import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl

  // Allow the request if following conditions are met:
  // 1. its a request for next-auth session & provider fetching
  // 2. The token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }
  // Redirect to login page if the token does not exist
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
