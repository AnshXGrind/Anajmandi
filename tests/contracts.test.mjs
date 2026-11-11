import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('auth form contains confirmation and terms fields', async () => {
  const source = await readFile('src/components/auth-form.tsx', 'utf8')
  assert.match(source, /name="confirm_password"/)
  assert.match(source, /agree_terms/)
  assert.match(source, /requiresEmailConfirmation/)
})

test('login page provides direct access to the public marketplace', async () => {
  const source = await readFile('src/app/login/page.tsx', 'utf8')
  assert.match(source, /Skip login and browse marketplace/)
  assert.match(source, /href="\/marketplace"/)
  assert.match(source, /safeRedirectPath/)
})

test('profile hardening protects moderation fields and private profile typing', async () => {
  const migration = await readFile('supabase/migrations/202611120003_harden_profile_updates.sql', 'utf8')
  const generatedTypes = await readFile('src/types/database.generated.ts', 'utf8')
  assert.match(migration, /verification_status is distinct from old\.verification_status/)
  assert.match(migration, /is_active is distinct from old\.is_active/)
  assert.match(generatedTypes, /get_my_private_profile: \{ Args: Record<string, never>; Returns: PrivateProfile\[\] \}/)
})

test('location migration and dependent selectors are present', async () => {
  const migration = await readFile('supabase/migrations/202611120004_india_location_master.sql', 'utf8')
  const picker = await readFile('src/components/location-picker.tsx', 'utf8')
  assert.match(migration, /create table if not exists public\.india_states/)
  assert.match(migration, /create table if not exists public\.india_districts/)
  assert.match(migration, /foreign key \(lgd_district_code, lgd_state_code\)/)
  assert.match(picker, /setDistrictCode\(''\)/)
  assert.match(picker, /disabled={!stateCode}/)
})

test('offer acceptance does not accept a caller-supplied actor id', async () => {
  const source = await readFile('supabase/migrations/202611120002_harden_farm_link_authorization.sql', 'utf8')
  assert.match(source, /auth\.uid\(\)/)
  assert.doesNotMatch(source, /accept_offer\(offer_id uuid, actor_id uuid\)/)
})

test('protected dashboards declare server-side role guards', async () => {
  for (const [file, role] of [['farmer', 'farmer'], ['buyer', 'buyer'], ['logistics', 'logistics_provider'], ['admin', 'admin']]) {
    const source = await readFile(`src/app/${file}/dashboard/page.tsx`, 'utf8')
    assert.match(source, /requirePageRole/)
    assert.match(source, new RegExp(role))
  }
})
