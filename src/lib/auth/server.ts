import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/env'
import { AuthError, ForbiddenError, NotFoundError } from '@/lib/utils/errors'
import type { UserRole } from '@/types'

export async function getCurrentUser() {
  if (!hasSupabaseConfig()) return null
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  const { data: profile } = await supabase.from('profiles').select('id, role, full_name').eq('id', user.id).maybeSingle()
  const typedProfile = profile as unknown as { id: string; role: UserRole; full_name: string } | null
  if (!typedProfile) return null
  return { user, profile: typedProfile }
}

export async function requireRole(roles: UserRole[]) {
  const session = await getCurrentUser()
  if (!session) throw new AuthError('Please sign in to continue')
  if (!roles.includes(session.profile.role)) throw new ForbiddenError('You do not have access to this area')
  return session
}

export async function requirePageRole(roles: UserRole[], loginPath = '/login') {
  try { return await requireRole(roles) } catch (error) {
    if (error instanceof AuthError) redirect(loginPath)
    throw error
  }
}

export function safeRedirectPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('://') || value.includes('\\')) return fallback
  return value
}

export function assertProfile(profile: { role?: UserRole } | null) {
  if (!profile) throw new NotFoundError('Application profile')
  if (!profile.role) throw new AuthError('Your account profile is incomplete')
  return profile as { role: UserRole }
}
