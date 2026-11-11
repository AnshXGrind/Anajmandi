import Link from 'next/link'
import { formatINR, formatWeight } from '@/lib/utils/format'
import type { ProduceListing } from '@/types'
export function MarketplaceCard({ listing }: { listing: ProduceListing }) { return <article className="listing-card"><div className="listing-image"><span>{listing.title.slice(0, 1).toUpperCase()}</span><small>{listing.quality_grade} grade</small></div><div className="listing-body"><div className="eyebrow">{listing.district}, {listing.state}</div><h3>{listing.title}</h3><p className="muted">Available {formatWeight(listing.quantity_kg)}</p><div className="listing-footer"><strong>{formatINR(listing.price_per_kg)}<small>/kg</small></strong><Link href={`/marketplace/${listing.id}`} className="arrow-link">View details →</Link></div></div></article> }
