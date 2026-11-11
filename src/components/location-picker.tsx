'use client'

import { useEffect, useMemo, useState } from 'react'

type StateOption = { lgd_state_code: number; name_en: string; entity_type: string }
type DistrictOption = { lgd_district_code: number; name_en: string }

export function LocationPicker() {
  const [states, setStates] = useState<StateOption[]>([])
  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [stateCode, setStateCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/locations/states')
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? 'Unable to load states')
        setStates(result.data ?? [])
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load states'))
  }, [])

  useEffect(() => {
    if (!stateCode) return
    fetch(`/api/locations/districts?state_code=${encodeURIComponent(stateCode)}`)
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? 'Unable to load districts')
        setDistricts(result.data ?? [])
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load districts'))
  }, [stateCode])

  const selectedState = states.find((state) => String(state.lgd_state_code) === stateCode)
  const selectedDistrict = districts.find((district) => String(district.lgd_district_code) === districtCode)
  const filteredDistricts = useMemo(() => districts.filter((district) => district.name_en.toLowerCase().includes(districtSearch.toLowerCase())), [districts, districtSearch])

  return <div className="form">
    <label>State<select className="select" name="lgd_state_code" value={stateCode} onChange={(event) => { setStateCode(event.target.value); setDistricts([]); setDistrictCode(''); setDistrictSearch('') }} required><option value="">Select state or union territory</option>{states.map((state) => <option key={state.lgd_state_code} value={state.lgd_state_code}>{state.name_en} ({state.entity_type})</option>)}</select></label>
    <input type="hidden" name="state" value={selectedState?.name_en ?? ''} />
    <label>District<input className="input" value={districtSearch} onChange={(event) => setDistrictSearch(event.target.value)} placeholder={stateCode ? 'Search district' : 'Select a state first'} disabled={!stateCode} aria-label="Search district" /><select className="select" name="lgd_district_code" value={districtCode} onChange={(event) => setDistrictCode(event.target.value)} required disabled={!stateCode} aria-label="District"><option value="">Select district</option>{filteredDistricts.map((district) => <option key={district.lgd_district_code} value={district.lgd_district_code}>{district.name_en}</option>)}</select></label>
    <input type="hidden" name="district" value={selectedDistrict?.name_en ?? ''} />
    {error && <span className="error-text" role="alert">{error}</span>}
  </div>
}
