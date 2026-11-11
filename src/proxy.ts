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
  if (protectedPath && user) { const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(); const role=(profile as unknown as {role?:string}|null)?.role; const allowed=request.nextUrl.pathname.startsWith('/farmer/')?role==='farmer':request.nextUrl.pathname.startsWith('/buyer/')?role==='buyer':request.nextUrl.pathname.startsWith('/logistics/')?role==='logistics_provider':request.nextUrl.pathname.startsWith('/admin/')?role==='admin':true; if(!allowed){const redirectUrl=request.nextUrl.clone();redirectUrl.pathname=role==='farmer'?'/farmer/dashboard':role==='buyer'?'/buyer/dashboard':role==='logistics_provider'?'/logistics/dashboard':role==='admin'?'/admin/dashboard':'/login';return NextResponse.redirect(redirectUrl)}}
  return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
