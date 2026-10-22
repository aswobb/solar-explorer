import { test } from 'node:test'
import assert from 'node:assert/strict'
import { anglesAt, displayTilt, isMotionSpeed, motionConfig, orbitDisplayPeriod, simulationStep, spinDisplayPeriod, wrapAngle } from '../src/scene/motion.ts'
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
test('equal elapsed time at 30/60/144 Hz produces equal movement', () => {
  const results = [30,60,144].map(fps => {
    let time = 0
    for (let i = 0; i < fps * 10; i++) time += simulationStep(1 / fps, 1, true)
    return anglesAt(time, 1.2, 365.2, 23.9)
  })
  for (const result of results) { near(result.orbit, results[0].orbit); near(result.spin, results[0].spin) }
})
test('pause freezes time, changing speed is continuous and scales future increments', () => {
  near(simulationStep(0.1, 1, false), 0)
  near(simulationStep(0.1, 5, false), 0)
  near(simulationStep(0.1, 2, true), 0.2)
  let time = simulationStep(0.1, 1, true)
  const before = anglesAt(time, 0.4, 88, 1407.6)
  time += simulationStep(0.1, 5, false)
  assert.deepEqual(anglesAt(time, 0.4, 88, 1407.6), before)
  time += simulationStep(0.1, 2, true)
  near(time, 0.3)
  near(simulationStep(100, 1, true), motionConfig.maxFrameDelta)
})
test('display periods preserve ordering with explicit separate Earth reference scales', () => {
  near(orbitDisplayPeriod(365.2), 40)
  near(spinDisplayPeriod(23.9), 12)
  assert.ok(orbitDisplayPeriod(88) < 40)
  assert.ok(orbitDisplayPeriod(59800) > 40)
  near(spinDisplayPeriod(-17.2), spinDisplayPeriod(17.2))
})
test('retrograde is encoded once with acute axis tilt and signed spin', () => {
  near(displayTilt(177.4), 2.6 * Math.PI / 180)
  near(displayTilt(97.8), 82.2 * Math.PI / 180)
  const forward = anglesAt(0.01, 0, 365.2, 23.9)
  const reverse = anglesAt(0.01, 0, 224.7, -5832.5)
  assert.ok(forward.spin > 0 && forward.spin < 0.1)
  assert.ok(reverse.spin > 6)
  assert.ok(forward.orbit > 6) // +Y prograde with the project's XZ angle convention
  near(anglesAt(10, 0, null, 609.12).orbit, 0)
  near(wrapAngle(-0.5), Math.PI * 2 - 0.5)
})
test('invalid inputs cannot inject NaN or unsupported speed into the animation', () => {
  for (const value of [0,3,NaN,Infinity]) assert.equal(isMotionSpeed(value),false)
  for (const args of [[NaN,1,true],[-1,1,true],[1,3,true]]) assert.throws(()=>simulationStep(...args),RangeError)
  for (const value of [0,-1,NaN]) assert.throws(()=>orbitDisplayPeriod(value),RangeError)
  for (const value of [0,NaN,Infinity]) assert.throws(()=>spinDisplayPeriod(value),RangeError)
  assert.throws(()=>displayTilt(181),RangeError)
  assert.throws(()=>anglesAt(-1,0,365.2,23.9),RangeError)
})
