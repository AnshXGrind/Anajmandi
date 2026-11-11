import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
export async function POST(request: Request){try{const input=registerSchema.parse(await request.json());const supabase=await createClient();const {data,error}=await supabase.auth.signUp({email:input.email,password:input.password,options:{data:{full_name:input.full_name,phone:input.phone,role:input.role,state:input.state}}});if(error) throw error;return NextResponse.json({userId:data.user?.id,role:input.role,requiresEmailConfirmation:!data.session},{status:201})}catch(error){return jsonError(error)}}
