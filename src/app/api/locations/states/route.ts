import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/env'
import { jsonError } from '@/lib/api'

export async function GET() {
  try {
    if (!hasSupabaseConfig()) return NextResponse.json({ error: 'Supabase is not configured', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    const supabase = await createClient()
    const result = await supabase.from('india_states').select('lgd_state_code,name_en,name_local,entity_type').eq('is_active', true).order('name_en')
    if (result.error) throw result.error
    return NextResponse.json({ data: result.data ?? [] })
  } catch (error) {
    return jsonError(error)
  }
}
