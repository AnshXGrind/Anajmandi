import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
import { safeRedirectPath } from '@/lib/auth/server'
export const instant = false
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) { const params = await searchParams; const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next; const nextPath = requestedNext ? safeRedirectPath(requestedNext, '/') : undefined; return <main className="auth-wrap"><div className="auth-card"><div className="eyebrow">Welcome back</div><h1>Log in to FarmLink.</h1><p className="muted">Pick up where your market left off.</p><AuthForm mode="login" nextPath={nextPath}/><Link className="button button-secondary" href="/marketplace">Skip login and browse marketplace</Link><p className="auth-note">New to FarmLink? <a className="arrow-link" href="/register">Create an account →</a></p></div></main> }
