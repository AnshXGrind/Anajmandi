import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/env'
import { jsonError } from '@/lib/api'

const querySchema = z.coerce.number().int().positive()

export async function GET(request: Request) {
  try {
    if (!hasSupabaseConfig()) return NextResponse.json({ error: 'Supabase is not configured', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    const stateCode = querySchema.parse(new URL(request.url).searchParams.get('state_code'))
    const supabase = await createClient()
    const result = await supabase.from('india_districts').select('lgd_district_code,name_en,name_local').eq('lgd_state_code', stateCode).eq('is_active', true).order('name_en')
    if (result.error) throw result.error
    return NextResponse.json({ data: result.data ?? [] })
  } catch (error) {
    return jsonError(error)
  }
}
