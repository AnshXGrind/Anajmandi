import test from 'node:test'
import assert from 'node:assert/strict'

test('E2E environment is explicit', () => {
  assert.ok(!process.env.BASE_URL || /^https?:\/\//.test(process.env.BASE_URL), 'BASE_URL must be an http(s) URL when provided')
})
