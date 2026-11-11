import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/env'
import { MarketplaceCard } from '@/components/marketplace-card'
import type { ProduceListing } from '@/types'

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ q?: string; state?: string }> }) {
  const params = await searchParams
  let listings: ProduceListing[] = []
  let configured = hasSupabaseConfig()
  if (configured) {
    const supabase = await createClient()
    let query = supabase.from('produce_listings').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(24)
    if (params.q) query = query.ilike('title', `%${params.q}%`)
    if (params.state) query = query.eq('state', params.state)
    const result = await query
    if (!result.error) listings = (result.data ?? []) as ProduceListing[]
  }
  return <main><section className="page-hero"><div className="container"><div className="eyebrow">The FarmLink marketplace</div><h1>Find your next good source.</h1><p className="muted">Browse produce listed directly by farmers across India. Search by crop or location and start a conversation built around clear terms.</p></div></section><section className="marketplace-toolbar"><div className="container"><form className="toolbar"><input className="input" name="q" defaultValue={params.q} placeholder="Search crops, varieties..." aria-label="Search listings"/><select className="select" name="state" defaultValue={params.state ?? ''} aria-label="Filter by state"><option value="">All states</option><option>Telangana</option><option>Andhra Pradesh</option><option>Maharashtra</option><option>Karnataka</option></select><button className="button button-small" type="submit">Search</button></form></div></section><section className="marketplace-content"><div className="container">{!configured ? <div className="empty-state"><h2>Marketplace is ready for your Supabase project.</h2><p className="muted">Add the two public Supabase variables from <code>.env.example</code> to load live listings. No placeholder records are shown.</p></div> : listings.length === 0 ? <div className="empty-state"><h2>No listings match that search.</h2><p className="muted">Try a broader crop name or check back after farmers publish their next harvest.</p></div> : <div className="listing-grid">{listings.map((listing) => <MarketplaceCard key={listing.id} listing={listing}/>)}</div>}</div></section></main>
}
