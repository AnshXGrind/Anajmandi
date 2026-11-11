import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
import { enforceRateLimit } from '@/lib/security/rate-limit'
export async function POST(request: Request){try{enforceRateLimit(request,'auth-register',5);const body=await request.json();const input=registerSchema.parse({...body,agree_terms:body.agree_terms===true||body.agree_terms==='true'||body.agree_terms==='on'});const supabase=await createClient();const {data,error}=await supabase.auth.signUp({email:input.email,password:input.password,options:{data:{full_name:input.full_name,phone:input.phone,role:input.role,state:input.state}}});if(error){if(error.message.toLowerCase().includes('already registered')) return NextResponse.json({error:'An account with this email already exists',code:'ACCOUNT_EXISTS'}, {status:409});throw error}return NextResponse.json({userId:data.user?.id,role:input.role,requiresEmailConfirmation:!data.session,message:!data.session?'Check your email to verify your account before signing in.':undefined},{status:201})}catch(error){return jsonError(error)}}
