import { NextResponse } from 'next/server'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
import { enforceRateLimit } from '@/lib/security/rate-limit'
export async function POST(request: Request){try{enforceRateLimit(request,'auth-forgot-password',5);const {email}=forgotPasswordSchema.parse(await request.json());const supabase=await createClient();const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/reset-password`});if(error) throw error;return NextResponse.json({message:'If that email is registered, a recovery link is on its way.'})}catch(error){return jsonError(error)}}
