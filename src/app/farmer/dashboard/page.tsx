import { requirePageRole } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
export const instant = false
export default async function FarmerDashboard(){
  const session=await requirePageRole(['farmer'])
  const supabase=await createClient()
  const [listingsResult,offersResult,ordersResult]=await Promise.all([
    supabase.from('produce_listings').select('id,title,available_quantity_kg,price_per_kg,status,created_at',{count:'exact'}).eq('farmer_id',session.user.id).order('created_at',{ascending:false}).limit(8),
    supabase.from('buyer_offers').select('id,status,quantity_kg,offered_price_per_kg,created_at',{count:'exact'}).eq('farmer_id',session.user.id).eq('status','pending').order('created_at',{ascending:false}).limit(8),
    supabase.from('orders').select('id,order_number,status,total_amount,created_at',{count:'exact'}).eq('farmer_id',session.user.id).order('created_at',{ascending:false}).limit(8),
  ])
  const error=listingsResult.error||offersResult.error||ordersResult.error
  const listings=listingsResult.data??[]
  const offers=offersResult.data??[]
  const orders=ordersResult.data??[]
  return <main><section className="page-hero"><div className="container"><div className="eyebrow">Farmer workspace</div><h1>Your harvest, in one place.</h1><p className="muted">Manage listings and respond to buyer interest from your live FarmLink records.</p><div className="hero-actions"><Link href="/farmer/dashboard/new" className="button">Create listing</Link><Link href="/marketplace" className="button button-secondary">Browse marketplace</Link></div></div></section><section className="section"><div className="container">{error?<div className="empty-state"><h2>We could not load your dashboard.</h2><p className="muted">Please try again. Your records have not been changed.</p></div>:<><div className="feature-grid"><article className="feature-card"><div className="eyebrow">My listings</div><h2>{listingsResult.count??0}</h2><p className="muted">Listings owned by your account.</p></article><article className="feature-card"><div className="eyebrow">Pending offers</div><h2>{offersResult.count??0}</h2><p className="muted">Buyer offers waiting for a decision.</p></article><article className="feature-card"><div className="eyebrow">Orders</div><h2>{ordersResult.count??0}</h2><p className="muted">Orders connected to your listings.</p></article></div><div className="section-heading" style={{marginTop:50}}><div><div className="eyebrow">Recent activity</div><h2>Live records</h2></div></div><div className="feature-grid"><article className="feature-card"><h3>Recent listings</h3>{listings.length===0?<p className="muted">You have not published a listing yet.</p>:<ul>{listings.map((listing)=><li key={listing.id}><Link className="arrow-link" href={`/marketplace/${listing.id}`}>{listing.title}</Link><span className="muted"> · {listing.status} · {listing.available_quantity_kg} kg available</span></li>)}</ul>}</article><article className="feature-card"><h3>Offers to review</h3>{offers.length===0?<p className="muted">No pending offers.</p>:<ul>{offers.map((offer)=><li key={offer.id}><span>{offer.quantity_kg} kg at ₹{offer.offered_price_per_kg}/kg</span></li>)}</ul>}</article><article className="feature-card"><h3>Orders</h3>{orders.length===0?<p className="muted">No orders yet.</p>:<ul>{orders.map((order)=><li key={order.id}><span>{order.order_number} · {order.status}</span></li>)}</ul>}</article></div></>}</div></section></main>
}
