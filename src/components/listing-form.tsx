'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ListingForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error ?? 'Unable to create listing.')
        return
      }
      router.push('/farmer/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <form className="form" onSubmit={submit}>
    <label>Crop title<input className="input" name="title" required minLength={2} maxLength={120} placeholder="e.g. Red onions" /></label>
    <label>Description<textarea className="input" name="description" rows={4} maxLength={2000} /></label>
    <label>Quality<select className="select" name="quality_grade" defaultValue="B"><option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option></select></label>
    <label>Price per kg<input className="input" name="price_per_kg" type="number" min="0.01" step="0.01" required /></label>
    <label>Quantity in kg<input className="input" name="quantity_kg" type="number" min="0.01" step="0.01" required /></label>
    <label>Pickup address<input className="input" name="pickup_address" required minLength={3} /></label>
    <label>State<input className="input" name="state" required minLength={2} /></label>
    <label>District<input className="input" name="district" required minLength={2} /></label>
    {error&&<div className="error-text" role="alert">{error}</div>}
    <button className="button" disabled={busy}>{busy?'Publishing…':'Publish listing'}</button>
  </form>
}
