import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const statesPath = path.join(root, 'supabase', 'seeds', 'lgd_states.csv')
const districtsPath = path.join(root, 'supabase', 'seeds', 'lgd_districts.csv')

function parseCsv(source) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"') quoted = true
    else if (character === ',') { row.push(field); field = '' }
    else if (character === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = '' }
    else field += character
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const headers = rows.shift()
  return rows.filter((entry) => entry.some(Boolean)).map((entry) => Object.fromEntries(headers.map((header, index) => [header, entry[index] ?? ''])))
}

const states = parseCsv(await readFile(statesPath, 'utf8'))
const districts = parseCsv(await readFile(districtsPath, 'utf8'))
const requiredStates = new Set([
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
])

const stateCodes = new Set(states.map((state) => state.state_code))
const districtCodes = new Set()
const errors = []
for (const state of states) {
  if (!state.state_code || !state.state_name_english) errors.push(`Invalid state row: ${JSON.stringify(state)}`)
  if (stateCodes.size !== states.length) errors.push('Duplicate LGD state code')
}
for (const district of districts) {
  if (!stateCodes.has(district.state_code)) errors.push(`District ${district.district_code} references missing state ${district.state_code}`)
  if (districtCodes.has(district.district_code)) errors.push(`Duplicate LGD district code ${district.district_code}`)
  districtCodes.add(district.district_code)
}
const canonical = (value) => value.trim().toLowerCase().replace(/^the\s+/, '')
for (const name of requiredStates) {
  if (!states.some((state) => canonical(state.state_name_english) === canonical(name))) errors.push(`Missing required State/UT: ${name}`)
}
if (states.length !== 36) errors.push(`Expected 36 State/UT rows, found ${states.length}`)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ states: states.length, districts: districts.length, stateCodes: stateCodes.size, districtCodes: districtCodes.size }, null, 2))
}
