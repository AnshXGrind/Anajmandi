import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonError } from '@/lib/api'
import { AuthError, ForbiddenError, NotFoundError } from '@/lib/utils/errors'
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const supabase=await createClient();const db=supabase as any;const {data:{user}}=await supabase.auth.getUser();if(!user)throw new AuthError();const {data:offer}=await db.from('buyer_offers').select('*').eq('id',id).single();if(!offer)throw new NotFoundError('Offer');if(offer.farmer_id!==user.id)throw new ForbiddenError('Only the listing farmer can accept this offer');const {data,error}=await db.rpc('accept_offer',{offer_id:id,actor_id:user.id});if(error)throw error;return NextResponse.json({data})}catch(error){return jsonError(error)}}
