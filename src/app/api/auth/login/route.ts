import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
export async function POST(request: Request){try{const input=loginSchema.parse(await request.json());const supabase=await createClient();const {data,error}=await supabase.auth.signInWithPassword(input);if(error||!data.user) throw error ?? new Error('Invalid login credentials');const profile=await supabase.from('profiles').select('role').eq('id',data.user.id).single();return NextResponse.json({role:profile.data?.role ?? 'buyer'})}catch(error){return jsonError(error)}}
