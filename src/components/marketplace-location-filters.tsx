'use client'

import { useEffect, useMemo, useState } from 'react'

type StateOption = { lgd_state_code: number; name_en: string; entity_type: string }
type DistrictOption = { lgd_district_code: number; name_en: string }

export function MarketplaceLocationFilters({ initialStateCode = '', initialDistrictCode = '' }: { initialStateCode?: string; initialDistrictCode?: string }) {
  const [states, setStates] = useState<StateOption[]>([])
  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [stateCode, setStateCode] = useState(initialStateCode)
  const [districtCode, setDistrictCode] = useState(initialDistrictCode)
  const [districtSearch, setDistrictSearch] = useState('')

  useEffect(() => {
    fetch('/api/locations/states').then((response) => response.json()).then((result) => setStates(result.data ?? []))
  }, [])

  useEffect(() => {
    if (!stateCode) {
      return
    }
    fetch(`/api/locations/districts?state_code=${encodeURIComponent(stateCode)}`).then((response) => response.json()).then((result) => {
      setDistricts(result.data ?? [])
      if (!result.data?.some((district: DistrictOption) => String(district.lgd_district_code) === districtCode)) setDistrictCode('')
    })
  }, [stateCode, districtCode])

  const filteredDistricts = useMemo(() => districts.filter((district) => district.name_en.toLowerCase().includes(districtSearch.toLowerCase())), [districts, districtSearch])
  return <><select className="select" name="lgd_state_code" value={stateCode} onChange={(event) => { setStateCode(event.target.value); setDistrictCode('') }} aria-label="Filter by state"><option value="">All states and union territories</option>{states.map((state) => <option key={state.lgd_state_code} value={state.lgd_state_code}>{state.name_en} ({state.entity_type})</option>)}</select><input type="hidden" name="state_code" value={stateCode} /><input className="input" name="district_search" value={districtSearch} onChange={(event) => setDistrictSearch(event.target.value)} placeholder={stateCode ? 'Search district' : 'Select state first'} disabled={!stateCode} aria-label="Search district" /><select className="select" name="lgd_district_code" value={districtCode} onChange={(event) => setDistrictCode(event.target.value)} disabled={!stateCode} aria-label="Filter by district"><option value="">All districts</option>{filteredDistricts.map((district) => <option key={district.lgd_district_code} value={district.lgd_district_code}>{district.name_en}</option>)}</select></>
}
