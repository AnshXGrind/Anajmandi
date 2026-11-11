import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('auth form contains confirmation and terms fields', async () => {
  const source = await readFile('src/components/auth-form.tsx', 'utf8')
  assert.match(source, /name="confirm_password"/)
  assert.match(source, /agree_terms/)
  assert.match(source, /requiresEmailConfirmation/)
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
