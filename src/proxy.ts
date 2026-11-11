import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return response
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } } })
  const { data: { user } } = await supabase.auth.getUser()
  const protectedPath = ['/dashboard', '/farmer', '/buyer', '/logistics', '/admin'].some((path) => request.nextUrl.pathname.startsWith(path))
  if (protectedPath && !user) { const redirectUrl=request.nextUrl.clone(); redirectUrl.pathname='/login'; redirectUrl.searchParams.set('next',request.nextUrl.pathname); return NextResponse.redirect(redirectUrl) }
  return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
