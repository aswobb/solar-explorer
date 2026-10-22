import test from 'node:test'
import assert from 'node:assert/strict'
import { isQuality, qualitySettings } from '../src/scene/quality.ts'
test('quality input is bounded and lightweight reduces pixel and geometry budgets', () => {
  assert.equal(isQuality('eco'), true)
  assert.equal(isQuality('standard'), true)
  for (const value of ['', 'high', '__proto__']) assert.equal(isQuality(value), false)
  const { standard, eco } = qualitySettings
  assert.ok(eco.maxDpr >= 1 && eco.maxDpr < standard.maxDpr && standard.maxDpr <= 1.5)
  assert.ok(eco.stars < standard.stars && eco.brightStars <= eco.stars)
  for (const key of ['sphere', 'detailSphere']) {
    assert.ok(eco[key][0] * eco[key][1] < standard[key][0] * standard[key][1])
    assert.ok(eco[key][0] >= 16 && eco[key][1] >= 12)
  }
})
