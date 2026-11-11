import { requirePageRole } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
export const instant = false
export default async function BuyerDashboard(){
  const session=await requirePageRole(['buyer'])
  const supabase=await createClient()
  const [offersResult,ordersResult]=await Promise.all([
    supabase.from('buyer_offers').select('id,status,quantity_kg,offered_price_per_kg,created_at',{count:'exact'}).eq('buyer_id',session.user.id).order('created_at',{ascending:false}).limit(8),
    supabase.from('orders').select('id,order_number,status,total_amount,created_at',{count:'exact'}).eq('buyer_id',session.user.id).order('created_at',{ascending:false}).limit(8),
  ])
  const error=offersResult.error||ordersResult.error
  const offers=offersResult.data??[]
  const orders=ordersResult.data??[]
  return <main><section className="page-hero"><div className="container"><div className="eyebrow">Buyer workspace</div><h1>Source with confidence.</h1><p className="muted">Track your offers and orders from your live FarmLink account.</p><div className="hero-actions"><Link href="/marketplace" className="button">Discover produce</Link></div></div></section><section className="section"><div className="container">{error?<div className="empty-state"><h2>We could not load your dashboard.</h2><p className="muted">Please try again. Your records have not been changed.</p></div>:<><div className="feature-grid"><article className="feature-card"><div className="eyebrow">My offers</div><h2>{offersResult.count??0}</h2><p className="muted">Offers submitted from your account.</p></article><article className="feature-card"><div className="eyebrow">My orders</div><h2>{ordersResult.count??0}</h2><p className="muted">Orders created from accepted offers.</p></article><article className="feature-card"><div className="eyebrow">Next step</div><h2>Find produce</h2><p className="muted">Browse active listings and make a purchase offer.</p></article></div><div className="section-heading" style={{marginTop:50}}><div><div className="eyebrow">Recent activity</div><h2>Your sourcing trail</h2></div></div><div className="feature-grid"><article className="feature-card"><h3>Offers</h3>{offers.length===0?<p className="muted">No offers yet.</p>:<ul>{offers.map((offer)=><li key={offer.id}><span>{offer.status} · {offer.quantity_kg} kg at ₹{offer.offered_price_per_kg}/kg</span></li>)}</ul>}</article><article className="feature-card"><h3>Orders</h3>{orders.length===0?<p className="muted">No orders yet.</p>:<ul>{orders.map((order)=><li key={order.id}><span>{order.order_number} · {order.status}</span></li>)}</ul>}</article></div></>}</div></section></main>
}
