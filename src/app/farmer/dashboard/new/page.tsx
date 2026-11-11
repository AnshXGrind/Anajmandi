import Link from 'next/link'
import { ListingForm } from '@/components/listing-form'
import { requirePageRole } from '@/lib/auth/server'

export const instant = false

export default async function NewListingPage() {
  await requirePageRole(['farmer'])
  return <main className="auth-wrap"><div className="auth-card"><Link className="arrow-link" href="/farmer/dashboard">← Back to dashboard</Link><div className="eyebrow" style={{marginTop:22}}>New listing</div><h1>Put your harvest on the map.</h1><p className="muted">Publish the details buyers need to make a serious offer.</p><ListingForm /></div></main>
}
