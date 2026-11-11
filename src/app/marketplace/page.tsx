import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/env'
import { MarketplaceCard } from '@/components/marketplace-card'
import type { ProduceListing } from '@/types'

export const instant = false

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const rawParams = await searchParams
  const params = Object.fromEntries(Object.entries(rawParams).map(([key, value]) => [key, first(value)])) as Record<string, string | undefined>
  let listings: ProduceListing[] = []
  let total = 0
  let queryError = ''
  let categories: { id: string; name: string }[] = []
  const configured = hasSupabaseConfig()
  if (configured) {
    const supabase = await createClient()
    let query = supabase.from('produce_listings').select('*', { count: 'exact' }).eq('status', 'active')
    if (params.q) query = query.ilike('title', `%${params.q}%`)
    if (params.state) query = query.eq('state', params.state)
    if (params.district) query = query.eq('district', params.district)
    if (params.quality_grade === 'A' || params.quality_grade === 'B' || params.quality_grade === 'C') query = query.eq('quality_grade', params.quality_grade)
    if (params.category_id) query = query.eq('category_id', params.category_id)
    if (params.min_price) query = query.gte('price_per_kg', Number(params.min_price))
    if (params.max_price) query = query.lte('price_per_kg', Number(params.max_price))
    if (params.min_quantity) query = query.gte('available_quantity_kg', Number(params.min_quantity))
    if (params.max_quantity) query = query.lte('available_quantity_kg', Number(params.max_quantity))
    if (params.sort === 'price_asc') query = query.order('price_per_kg', { ascending: true })
    else if (params.sort === 'price_desc') query = query.order('price_per_kg', { ascending: false })
    else if (params.sort === 'quantity_desc') query = query.order('available_quantity_kg', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const page = Math.max(1, Number(params.page) || 1)
    const pageSize = 12
    const result = await query.range((page - 1) * pageSize, page * pageSize - 1)
    if (result.error) queryError = result.error.message
    else {
      listings = (result.data ?? []) as unknown as ProduceListing[]
      total = result.count ?? 0
    }
    const categoriesResult = await supabase.from('produce_categories').select('id,name').order('name')
    if (!categoriesResult.error) categories = categoriesResult.data ?? []
  }
  const page = Math.max(1, Number(params.page) || 1)
  const hasNextPage = page * 12 < total
  return <main><section className="page-hero"><div className="container"><div className="eyebrow">The FarmLink marketplace</div><h1>Find your next good source.</h1><p className="muted">Browse produce listed directly by farmers across India. Search by crop or location and start a conversation built around clear terms.</p></div></section><section className="marketplace-toolbar"><div className="container"><form className="toolbar"><input className="input" name="q" defaultValue={params.q} placeholder="Search crops, varieties..." aria-label="Search listings"/><select className="select" name="category_id" defaultValue={params.category_id ?? ''} aria-label="Filter by category"><option value="">All categories</option>{categories.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}</select><select className="select" name="state" defaultValue={params.state ?? ''} aria-label="Filter by state"><option value="">All states</option><option>Telangana</option><option>Andhra Pradesh</option><option>Maharashtra</option><option>Karnataka</option></select><input className="input" name="district" defaultValue={params.district} placeholder="District" aria-label="Filter by district"/><select className="select" name="quality_grade" defaultValue={params.quality_grade ?? ''} aria-label="Filter by quality"><option value="">All quality grades</option><option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option></select><select className="select" name="sort" defaultValue={params.sort ?? 'newest'} aria-label="Sort listings"><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="quantity_desc">Most available</option></select><button className="button button-small" type="submit">Search</button></form></div></section><section className="marketplace-content"><div className="container">{!configured ? <div className="empty-state"><h2>Marketplace is ready for your Supabase project.</h2><p className="muted">Add the two public Supabase variables from <code>.env.example</code> to load live listings. No placeholder records are shown.</p></div> : queryError ? <div className="empty-state"><h2>Marketplace could not be loaded.</h2><p className="muted">{queryError}</p></div> : listings.length === 0 ? <div className="empty-state"><h2>No listings match that search.</h2><p className="muted">Try a broader crop name or check back after farmers publish their next harvest.</p></div> : <><div className="listing-grid">{listings.map((listing) => <MarketplaceCard key={listing.id} listing={listing}/>)}</div><div className="hero-actions"><span className="muted">Page {page} of {Math.max(1, Math.ceil(total / 12))}</span>{page>1&&<Link href={`/marketplace?page=${page-1}`} className="button button-secondary">Previous</Link>}{hasNextPage&&<Link href={`/marketplace?page=${page+1}`} className="button button-secondary">Next</Link>}</div></>}</div></section></main>
}
