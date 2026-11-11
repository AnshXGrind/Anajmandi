import { createBrowserClient } from '@supabase/ssr'
import type { FarmLinkDatabase } from '@/types/database.generated'
import { getPublicEnv } from '@/lib/env'

export function createClient() {
  const env = getPublicEnv()
  return createBrowserClient<FarmLinkDatabase>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
