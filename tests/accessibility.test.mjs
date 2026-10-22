import test from 'node:test'
import assert from 'node:assert/strict'
import { orbitAngles, controlLimits } from '../src/scene/cameraControl.ts'
import { motionPreference } from '../src/components/motionPreference.ts'

test('keyboard orbit reverses horizontally and clamps at both polar limits', () => {
  const left = orbitAngles(0, 0.8, 'left')
  assert.ok(left.azimuth < 0)
  assert.equal(orbitAngles(left.azimuth, left.polar, 'right').azimuth, 0)
  assert.equal(orbitAngles(0, controlLimits.minPolar, 'up').polar, controlLimits.minPolar)
  assert.equal(orbitAngles(0, controlLimits.maxPolar, 'down').polar, controlLimits.maxPolar)
  assert.throws(() => orbitAngles(NaN, 0.8, 'left'), RangeError)
})
test('system motion preference reads changes and unsubscribes without stale notifications', () => {
  const media = new EventTarget()
  media.matches = false
  const preference = motionPreference(media)
  const values = []
  const unsubscribe = preference.subscribe(() => values.push(preference.snapshot()))
  assert.equal(preference.snapshot(), false)
  media.matches = true
  media.dispatchEvent(new Event('change'))
  media.matches = false
  media.dispatchEvent(new Event('change'))
  assert.deepEqual(values, [true, false])
  unsubscribe()
  media.dispatchEvent(new Event('change'))
  assert.equal(values.length, 2)
})
