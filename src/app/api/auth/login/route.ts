import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
import { AuthError, NotFoundError } from '@/lib/utils/errors'
import { assertProfile } from '@/lib/auth/server'
import { enforceRateLimit } from '@/lib/security/rate-limit'
export async function POST(request: Request){try{enforceRateLimit(request,'auth-login');const input=loginSchema.parse(await request.json());const supabase=await createClient();const {data,error}=await supabase.auth.signInWithPassword(input);if(error||!data.user) throw new AuthError('Invalid email or password');const profileResult=await supabase.from('profiles').select('role').eq('id',data.user.id).maybeSingle();if(profileResult.error) throw profileResult.error;const profile=assertProfile(profileResult.data);return NextResponse.json({role:profile.role})}catch(error){if(error instanceof NotFoundError) return jsonError(error);return jsonError(error)}}
